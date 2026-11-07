import { InputError } from "../../shared/utils/input-error";

const REQUEST_TIMEOUT_MS = 15_000;

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const signal = options.signal
    ? AbortSignal.any([options.signal, timeout])
    : timeout;
  const response = await fetch(`/api/${path}`, { ...options, signal });
  const data: unknown = await response.json();
  if (!response.ok) {
    const error =
      data && typeof data === "object" ? (data as Record<string, unknown>) : {};
    throw new InputError(
      typeof error.message === "string"
        ? error.message
        : "Не удалось обработать запрос.",
      typeof error.field === "string" ? error.field : "",
      response.status,
    );
  }
  return data as T;
}
