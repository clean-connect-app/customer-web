import { InputError } from "../shared/utils/input-error";
import type {
  IPendingOrderRequest,
  IOrderFormValues,
  TOrderStep,
} from "./types/index";
import { useEffect, useRef, useState } from "react";
import type { IBasketItem, ICatalog } from "../shared/types/index";
import type {
  ICustomerOrder,
  ICustomerOrderInput,
} from "../shared/types/customer-order";
import { calculateQuote } from "../shared/rules";
import { createOrder, getQuote, getSession } from "./api";
import { orderError } from "./utils/errors";
import { draftOrder } from "./utils/order-form";

const BASKET_KEY = "clean-connect-basket";

const EMPTY_FORM: IOrderFormValues = {
  name: "",
  phone: "",
  address: "",
  pointId: "",
  date: "",
  slotId: "",
  returnDate: "",
  returnSlotId: "",
  note: "",
};

function restoreBasket(catalog: ICatalog): IBasketItem[] {
  try {
    const saved: unknown = JSON.parse(
      sessionStorage.getItem(BASKET_KEY) ?? "null",
    );
    const quote = calculateQuote(saved, catalog);
    return quote.lines.map(({ serviceId, quantity }) => ({
      serviceId,
      quantity,
    }));
  } catch {
    return [];
  }
}

function rememberBasket(basket: IBasketItem[]) {
  try {
    if (basket.length) {
      sessionStorage.setItem(BASKET_KEY, JSON.stringify(basket));
    } else {
      sessionStorage.removeItem(BASKET_KEY);
    }
  } catch {
    // Заказ доступен в кабинете и при отключённом хранилище браузера.
  }
}

export function useOrder(catalog: ICatalog, pointId: string) {
  const [basket, setBasket] = useState(() => restoreBasket(catalog));
  const [form, setForm] = useState<IOrderFormValues>({
    ...EMPTY_FORM,
    pointId,
  });
  const [step, setStep] = useState<TOrderStep>("services");
  const [receipt, setReceipt] = useState<ICustomerOrder | null>(null);
  const [error, setError] = useState<InputError | null>(() =>
    new URLSearchParams(location.search).has("login")
      ? new InputError("Войти не удалось. Попробуйте снова.", "")
      : null,
  );
  const [busy, setBusy] = useState(false);
  const requestController = useRef<AbortController | null>(null);
  const pendingOrder = useRef<IPendingOrderRequest | null>(null);

  useEffect(() => () => requestController.current?.abort(), []);

  const count = basket.reduce((sum, item) => sum + item.quantity, 0);
  const quote = basket.length > 0 ? calculateQuote(basket, catalog) : null;

  function goTo(next: TOrderStep) {
    setStep(next);
    setError(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function changeQuantity(serviceId: string, delta: number) {
    if (
      requestController.current ||
      !catalog.services.some((service) => service.id === serviceId)
    ) {
      return;
    }
    setError(null);
    setBasket((current) => {
      const quantity =
        (current.find((item) => item.serviceId === serviceId)?.quantity ?? 0) +
        delta;
      const total =
        current.reduce((sum, item) => sum + item.quantity, 0) + delta;
      if (
        quantity > catalog.limits.maxQuantityPerService ||
        total > catalog.limits.maxItems
      ) {
        return current;
      }
      if (quantity <= 0) {
        return current.filter((item) => item.serviceId !== serviceId);
      }
      const exists = current.some((item) => item.serviceId === serviceId);
      return exists
        ? current.map((item) =>
            item.serviceId === serviceId ? { serviceId, quantity } : item,
          )
        : [...current, { serviceId, quantity }];
    });
  }

  function changeField(field: keyof IOrderFormValues, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "pointId" || field === "date" ? { returnDate: "" } : {}),
    }));
    setError(null);
  }

  async function checkout() {
    if (!quote || requestController.current) {
      return;
    }
    const controller = new AbortController();
    requestController.current = controller;
    setBusy(true);
    setError(null);
    try {
      const [result, session] = await Promise.all([
        getQuote(basket, controller.signal),
        getSession(controller.signal),
      ]);
      if (controller.signal.aborted) {
        return;
      }
      if (result.catalogVersion !== catalog.version) {
        throw new InputError(
          "Тарифы изменились. Обновите страницу.",
          "catalogVersion",
          409,
        );
      }
      if (!session.authenticated) {
        if (!session.loginAvailable) {
          throw new InputError("Вход по email пока не настроен.", "");
        }
        rememberBasket(basket);
        location.assign("/api/auth/login?returnTo=%2F");
        return;
      }
      goTo("checkout");
    } catch (error: unknown) {
      if (!controller.signal.aborted) {
        setError(orderError(error));
      }
    } finally {
      requestController.current = null;
      if (!controller.signal.aborted) {
        setBusy(false);
      }
    }
  }

  async function submit() {
    if (requestController.current) {
      return;
    }
    setError(null);
    let input: ICustomerOrderInput;
    try {
      input = draftOrder(form, basket, catalog.version);
    } catch (error: unknown) {
      setError(orderError(error));
      return;
    }
    const payload = JSON.stringify(input);
    if (pendingOrder.current?.payload !== payload) {
      pendingOrder.current = { payload, key: crypto.randomUUID() };
    }
    const controller = new AbortController();
    requestController.current = controller;
    setBusy(true);
    try {
      const saved = await createOrder(
        input,
        pendingOrder.current.key,
        controller.signal,
      );
      if (!controller.signal.aborted) {
        pendingOrder.current = null;
        rememberBasket([]);
        setReceipt(saved);
        goTo("done");
      }
    } catch (error: unknown) {
      if (!controller.signal.aborted) {
        const failure = orderError(error);
        if (failure.statusCode === 401) {
          rememberBasket(basket);
          location.assign("/api/auth/login?returnTo=%2F");
        } else {
          setError(failure);
        }
      }
    } finally {
      requestController.current = null;
      if (!controller.signal.aborted) {
        setBusy(false);
      }
    }
  }

  return {
    basket,
    form,
    step,
    receipt,
    error,
    busy,
    count,
    quote,
    goTo,
    changeQuantity,
    changeField,
    checkout,
    submit,
  };
}
