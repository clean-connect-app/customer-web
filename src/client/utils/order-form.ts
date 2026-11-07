import type { IBasketItem } from "../../shared/types/index";
import type {
  ICustomerOrder,
  ICustomerOrderInput,
} from "../../shared/types/customer-order";
import { parseOrderInput } from "../../shared/rules";
import { InputError } from "../../shared/utils/input-error";
import type { IOrderFormValues } from "../types/index";

export function readOrderForm(order: ICustomerOrder): IOrderFormValues {
  return {
    ...order.order.customer,
    pointId: order.point.id,
    date: order.pickup.date,
    slotId: order.pickup.slotId,
    returnDate: order.returnSlot.date,
    returnSlotId: order.returnSlot.slotId,
    note: order.order.note,
  };
}

export function draftOrder(
  form: IOrderFormValues,
  items: IBasketItem[],
  catalogVersion: string,
): ICustomerOrderInput {
  const order = parseOrderInput({
    catalogVersion,
    items,
    customer: { name: form.name, phone: form.phone, address: form.address },
    pickup: { date: form.date, slotId: form.slotId },
    note: form.note,
  });
  for (const [key, message] of [
    ["pointId", "Выберите химчистку."],
    ["date", "Выберите дату забора."],
    ["slotId", "Выберите интервал забора."],
    ["returnDate", "Выберите дату возврата."],
    ["returnSlotId", "Выберите интервал возврата."],
  ] as const) {
    if (!form[key]) {
      throw new InputError(message, key);
    }
  }
  return {
    ...order,
    pointId: form.pointId,
    returnSlot: { date: form.returnDate, slotId: form.returnSlotId },
  };
}
