import { InputError } from "../../shared/utils/input-error";

export function orderError(error: unknown): InputError {
  if (error instanceof InputError) {
    return error;
  }
  return new InputError(
    "Нет ответа от сервера. Проверьте соединение и повторите отправку.",
  );
}
