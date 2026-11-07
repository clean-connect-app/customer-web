import type { IOrderReceiptProps } from "../types/index";

import { Arrow, Check } from "../icons";
import { dateLabel, money } from "../utils/format";

export function OrderReceipt({ receipt, onNewOrder }: IOrderReceiptProps) {
  return (
    <section className="success" aria-labelledby="success-title">
      <div className="success-check">
        <Check />
      </div>
      <div className="eyebrow">ВСЁ ПОЛУЧИЛОСЬ</div>
      <h2 id="success-title">Заказ оформлен</h2>
      <p>
        Заявка сохранена. Вещи скоро получат
        <br />
        свою порцию заботы.
      </p>
      <div className="receipt-header">
        <span>
          Номер заказа <strong>{receipt.number}</strong>
        </span>
        <span className="status-badge">{receipt.statusLabel}</span>
      </div>
      <div className="receipt-details">
        <div>
          <span>Возврат вещей</span>
          <strong>
            {dateLabel(receipt.returnSlot.date)}, {receipt.returnSlot.slotLabel}
          </strong>
        </div>
        <div>
          <span>Курьерский забор</span>
          <strong>
            {dateLabel(receipt.pickup.date)}, {receipt.pickup.slotLabel}
          </strong>
        </div>
        <div>
          <span>Часовой пояс</span>
          <strong>{receipt.pickup.timeZone}</strong>
        </div>
        {receipt.quote.lines.map((line) => (
          <div key={line.serviceId}>
            <span>
              {line.name} × {line.quantity}
            </span>
            <strong>{money(line.amountKopecks)}</strong>
          </div>
        ))}
        <div>
          <span>Забор и доставка</span>
          <strong>
            {receipt.quote.deliveryKopecks
              ? money(receipt.quote.deliveryKopecks)
              : "Бесплатно"}
          </strong>
        </div>
        <div className="receipt-total">
          <span>Итого</span>
          <strong>{money(receipt.quote.totalKopecks)}</strong>
        </div>
      </div>
      <button className="primary" onClick={onNewOrder}>
        Оформить ещё заказ <Arrow />
      </button>
      <a className="orders-link" href={`/orders/${receipt.id}`}>
        Открыть заказ
      </a>
    </section>
  );
}
