import type { IOrderStepsProps } from "../types/index";

import { Check } from "../icons";

export function OrderSteps({ step }: IOrderStepsProps) {
  return (
    <div className="steps" aria-label="Этапы оформления">
      {(["services", "checkout", "done"] as const).map((item, i) => (
        <div
          className={`step ${step === item ? "active" : ""} ${["services", "checkout", "done"].indexOf(step) > i ? "complete" : ""}`}
          key={item}
        >
          <span>
            {["services", "checkout", "done"].indexOf(step) > i ? (
              <Check />
            ) : (
              `0${i + 1}`
            )}
          </span>
          {["Выбор услуг", "Детали заказа", "Готово"][i]}
          {i < 2 && <i />}
        </div>
      ))}
    </div>
  );
}
