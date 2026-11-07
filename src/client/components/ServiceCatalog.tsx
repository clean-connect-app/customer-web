import type { IServiceCatalogProps } from "../types/index";

import { Check, Garment, Sparkle } from "../icons";
import { money } from "../utils/format";
import { QuantityControl } from "./QuantityControl";

export function ServiceCatalog({
  catalog,
  basket,
  category,
  busy,
  onCategoryChange: setCategory,
  onQuantityChange,
}: IServiceCatalogProps) {
  const count = basket.reduce((total, item) => total + item.quantity, 0);
  const categories = [
    "Все услуги",
    ...new Set(catalog.services.map((service) => service.category)),
  ];
  return (
    <section
      id="catalog"
      className="catalog-section"
      aria-labelledby="section-title"
    >
      <div className="section-heading">
        <h2 id="section-title">Что почистим?</h2>
        <span>{catalog.services.length} услуг</span>
      </div>
      <p className="section-description">
        Добавьте вещи в заказ. Всё остальное уже продумано.
      </p>
      <div className="tabs" role="group" aria-label="Категории услуг">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "selected" : ""}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="service-grid">
        {catalog.services
          .filter(
            (service) =>
              category === "Все услуги" || service.category === category,
          )
          .map((service) => {
            const quantity =
              basket.find((item) => item.serviceId === service.id)?.quantity ??
              0;
            return (
              <article
                className={`service-card ${quantity ? "in-basket" : ""}`}
                key={service.id}
              >
                <div className={`garment-art art-${service.icon}`}>
                  <Garment kind={service.icon} />
                  {quantity > 0 && (
                    <span className="selected-mark" aria-label="В заказе">
                      <Check />
                    </span>
                  )}
                  <span className="art-caption">БЕРЕЖНЫЙ УХОД</span>
                </div>
                <div className="service-body">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="service-bottom">
                    <div>
                      <strong>{money(service.priceKopecks)}</strong>
                      <span>за 1 шт.</span>
                    </div>
                    <QuantityControl
                      serviceId={service.id}
                      quantity={quantity}
                      name={service.name}
                      max={
                        quantity >= catalog.limits.maxQuantityPerService ||
                        count >= catalog.limits.maxItems
                      }
                      disabled={busy}
                      onChange={onQuantityChange}
                    />
                  </div>
                </div>
              </article>
            );
          })}
      </div>
      <div className="care-note">
        <Sparkle />
        <p>
          <strong>Индивидуальный уход за каждой вещью.</strong> Бережная чистка
          с учётом материала и рекомендаций по уходу.
        </p>
      </div>
    </section>
  );
}
