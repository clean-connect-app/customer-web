import type {
  IBasketItem,
  ICatalogResponse,
  IQuote,
} from "../shared/types/index";
import type {
  ICustomerOrder,
  ICustomerOrderInput,
  ICustomerOrderUpdate,
} from "../shared/types/customer-order";
import { request } from "./utils/request";
import type { ICustomerSession } from "./types/customer-orders";

export function getCatalog(signal: AbortSignal): Promise<ICatalogResponse> {
  return request("catalog", { signal });
}

export function getQuote(
  items: IBasketItem[],
  signal: AbortSignal,
): Promise<IQuote> {
  return request("quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
    signal,
  });
}

export function createOrder(
  input: ICustomerOrderInput,
  requestKey: string,
  signal: AbortSignal,
): Promise<ICustomerOrder> {
  return request("orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": requestKey,
    },
    body: JSON.stringify(input),
    signal,
  });
}

export function getSession(signal: AbortSignal): Promise<ICustomerSession> {
  return request("auth/session", { signal });
}

export async function logout(): Promise<void> {
  await request("auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
}

export function getOrders(signal: AbortSignal): Promise<ICustomerOrder[]> {
  return request("me/orders", { signal });
}

export function getOrder(
  id: string,
  signal: AbortSignal,
): Promise<ICustomerOrder> {
  return request(`me/orders/${encodeURIComponent(id)}`, { signal });
}

export function updateOrder(
  id: number,
  input: ICustomerOrderUpdate,
): Promise<ICustomerOrder> {
  return request(`me/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}
