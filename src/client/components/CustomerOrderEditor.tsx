import { useRef, useState } from "react";
import { updateOrder } from "../api";
import { calculateQuote } from "../../shared/rules";
import type { InputError } from "../../shared/utils/input-error";
import type { IQuote } from "../../shared/types/index";
import type { ICustomerOrderEditorProps } from "../types/customer-orders";
import type { IOrderFormValues } from "../types/index";
import { orderError } from "../utils/errors";
import { money } from "../utils/format";
import { draftOrder, readOrderForm } from "../utils/order-form";
import { CheckoutForm } from "./CheckoutForm";

export function CustomerOrderEditor({
  order,
  data,
  onBack,
  onSaved,
}: ICustomerOrderEditorProps) {
  const [form, setForm] = useState(() => readOrderForm(order));
  const [items, setItems] = useState(order.order.items);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<InputError | null>(null);
  const saving = useRef(false);
  const changedItems =
    items.length !== order.order.items.length ||
    items.some(
      (item) =>
        !order.order.items.some(
          (before) =>
            before.serviceId === item.serviceId &&
            before.quantity === item.quantity,
        ),
    );
  const services = new Map(
    order.quote.lines.map(({ serviceId, name }) => [serviceId, name]),
  );
  for (const service of data.catalog.services) {
    services.set(service.id, service.name);
  }
  let quote: IQuote | null = order.quote;
  let quoteError = "";
  if (changedItems) {
    try {
      quote = calculateQuote(items, data.catalog);
    } catch (cause: unknown) {
      quoteError = orderError(cause).message;
      quote = null;
    }
  }

  function changeField(field: keyof IOrderFormValues, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "date" ? { returnDate: "" } : {}),
    }));
    setError(null);
  }

  async function save() {
    if (!quote || saving.current) {
      return;
    }
    saving.current = true;
    setBusy(true);
    setError(null);
    try {
      const saved = await updateOrder(order.id, {
        order: draftOrder(form, items, quote.catalogVersion),
        version: order.version,
        expectedTotalKopecks: quote.totalKopecks,
      });
      onSaved(saved);
    } catch (cause: unknown) {
      setError(orderError(cause));
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="content-grid order-edit">
      <CheckoutForm
        data={data}
        form={form}
        editing={order}
        busy={busy}
        error={error}
        onChange={changeField}
        onSubmit={save}
        onBack={onBack}
      />
      <section
        className="order-card orders-panel"
        aria-labelledby="edit-services"
      >
        <h2 id="edit-services">Состав и стоимость</h2>
        <div className="edit-quantities">
          {[...services.entries()].map(([id, name]) => (
            <label key={id}>
              {name}
              <input
                type="number"
                min={0}
                max={data.catalog.limits.maxQuantityPerService}
                inputMode="numeric"
                disabled={busy}
                value={
                  items.find((item) => item.serviceId === id)?.quantity ?? 0
                }
                onChange={(event) => {
                  const quantity = Math.min(
                    data.catalog.limits.maxQuantityPerService,
                    Math.max(0, event.target.valueAsNumber || 0),
                  );
                  setItems((previous) => [
                    ...previous.filter((item) => item.serviceId !== id),
                    ...(quantity ? [{ serviceId: id, quantity }] : []),
                  ]);
                  setError(null);
                }}
              />
            </label>
          ))}
        </div>
        <p aria-live="polite">
          {quote ? (
            quote.totalKopecks === order.quote.totalKopecks ? (
              <>
                Итого <strong>{money(quote.totalKopecks)}</strong>
              </>
            ) : (
              <>
                Новая сумма <strong>{money(quote.totalKopecks)}</strong> · было{" "}
                {money(order.quote.totalKopecks)}
              </>
            )
          ) : (
            quoteError
          )}
        </p>
        {error && (
          <p id="form-error" className="error-state" role="alert">
            {error.message}
          </p>
        )}
        {error?.field === "version" && (
          <a href={`/orders/${order.id}`}>Обновить карточку</a>
        )}
        <button
          className="primary"
          form="order-form"
          type="submit"
          disabled={busy || !quote}
        >
          {busy ? "Сохраняем…" : "Подтвердить изменения"}
        </button>
      </section>
    </div>
  );
}
