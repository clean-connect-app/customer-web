import type { IOrderSummaryProps } from "../types/index";

import { Arrow, Drop, Sparkle, Truck } from "../icons";
import { money } from "../utils/format";

export function OrderSummary({
  catalog,
  quote,
  count,
  step,
  busy,
  error,
  onCheckout,
}: IOrderSummaryProps) {
  return (
    <aside className="order-sidebar" aria-labelledby="order-title">
      <div className="order-card">
        <div className="order-heading">
          <h2 id="order-title">Ваш заказ</h2>
          <span className="item-count" aria-live="polite">
            {count}
          </span>
        </div>
        {!quote ? (
          <div className="empty-basket">
            <div className="empty-icon">
              <Drop />
            </div>
            <h3>Здесь будут ваши вещи</h3>
            <p>
              Нажмите «+» у нужной услуги,
              <br />
              чтобы добавить её в заказ.
            </p>
          </div>
        ) : (
          <>
            <div className="basket-lines" aria-live="polite">
              {quote.lines.map((line) => (
                <div className="basket-line" key={line.serviceId}>
                  <div>
                    <strong>{line.name}</strong>
                    <span>
                      {line.quantity} шт. × {money(line.priceKopecks)}
                    </span>
                  </div>
                  <strong>{money(line.amountKopecks)}</strong>
                </div>
              ))}
            </div>
            <div className="price-breakdown">
              <div>
                <span>Стоимость услуг</span>
                <span>{money(quote.subtotalKopecks)}</span>
              </div>
              <div>
                <span>Забор и доставка</span>
                <span className={quote.deliveryKopecks === 0 ? "green" : ""}>
                  {quote.deliveryKopecks
                    ? money(quote.deliveryKopecks)
                    : "Бесплатно"}
                </span>
              </div>
            </div>
            <div className="order-total">
              <strong>Итого</strong>
              <strong>{money(quote.totalKopecks)}</strong>
            </div>
          </>
        )}
        <div className="delivery-tip">
          <Truck />
          <p>
            {quote && quote.deliveryKopecks === 0 ? (
              <>
                Доставка за наш счёт.
                <br />
                <strong>Ещё одна приятная мелочь.</strong>
              </>
            ) : (
              <>
                Бесплатный забор и доставка
                <br />
                при заказе от{" "}
                <strong>{money(catalog.delivery.freeFromKopecks)}</strong>
              </>
            )}
          </p>
        </div>
        {error && (
          <div id="form-error" className="form-error" role="alert">
            {error.message}
            {error.field === "catalogVersion" && (
              <button
                className="text-link"
                onClick={() => window.location.reload()}
              >
                Обновить каталог
              </button>
            )}
          </div>
        )}
        {step === "services" ? (
          <button
            className="primary checkout-button"
            disabled={!quote || busy}
            onClick={() => void onCheckout()}
          >
            {busy ? "Проверяем стоимость…" : "Перейти к оформлению"}
            <Arrow />
          </button>
        ) : (
          <button
            className="primary checkout-button"
            type="submit"
            form="order-form"
            disabled={!quote || busy}
          >
            {busy ? "Сохраняем заявку…" : "Оформить заказ"}
            <Arrow />
          </button>
        )}
        <p className="payment-note">Оплата после оказания услуги</p>
      </div>
      <div className="trust-note">
        <Sparkle />
        <p>
          Ваши вещи в хороших руках.
          <br />
          <strong>Забота в каждой детали.</strong>
        </p>
      </div>
    </aside>
  );
}
