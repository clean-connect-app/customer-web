import type { IQuantityControlProps } from "../types/index";
import { Minus, Plus } from "../icons";

export function QuantityControl({
  serviceId,
  quantity,
  name,
  max,
  disabled,
  onChange,
}: IQuantityControlProps) {
  return quantity === 0 ? (
    <button
      className="add-button"
      disabled={disabled || max}
      aria-label={`Добавить: ${name}`}
      onClick={() => onChange(serviceId, 1)}
    >
      <Plus />
    </button>
  ) : (
    <div className="quantity">
      <button
        disabled={disabled}
        aria-label={`Убрать одну вещь: ${name}`}
        onClick={() => onChange(serviceId, -1)}
      >
        <Minus />
      </button>
      <span aria-label={`Количество: ${quantity}`}>{quantity}</span>
      <button
        disabled={disabled || max}
        aria-label={`Добавить одну вещь: ${name}`}
        onClick={() => onChange(serviceId, 1)}
      >
        <Plus />
      </button>
    </div>
  );
}
