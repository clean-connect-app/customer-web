export type TOrderStep = "services" | "checkout" | "done";

export interface IOrderFormValues {
  name: string;
  phone: string;
  address: string;
  pointId: string;
  date: string;
  slotId: string;
  returnDate: string;
  returnSlotId: string;
  note: string;
}

export interface IPendingOrderRequest {
  payload: string;
  key: string;
}
