import type { ChangeEvent, FormEvent } from "react";
import type { ICheckoutFormProps, IOrderFormValues } from "../types/index";
import { useEffect, useRef } from "react";
import { Arrow } from "../icons";
import { dateLabel } from "../utils/format";

export function CheckoutForm({
  data,
  form,
  editing,
  busy,
  error,
  onChange,
  onSubmit,
  onBack,
}: ICheckoutFormProps) {
  const { catalog, points, pickupDates, returnDates } = data;
  const point = points.find(({ id }) => id === form.pointId) ?? editing?.point;
  const earliestReturn =
    form.date && point
      ? new Date(
          Date.parse(`${form.date}T00:00:00Z`) +
            point.minimumReturnDays * 86_400_000,
        )
          .toISOString()
          .slice(0, 10)
      : "";
  const pickupOptions = [
    ...new Set([...(editing ? [editing.pickup.date] : []), ...pickupDates]),
  ];
  const returnOptions = [
    ...new Set([
      ...(editing && form.date === editing.pickup.date
        ? [editing.returnSlot.date]
        : []),
      ...returnDates.filter((date) => earliestReturn && date >= earliestReturn),
    ]),
  ];
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (error) {
      const element = formRef.current?.elements.namedItem(error.field);
      if (element instanceof HTMLElement) {
        element.focus();
      }
    }
  }, [error]);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit();
  }
  function field(name: keyof IOrderFormValues) {
    return {
      name,
      value: form[name],
      disabled: busy,
      "aria-invalid": error?.field === name || undefined,
      "aria-describedby": error?.field === name ? "form-error" : undefined,
      onChange: (
        event: ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
      ) => onChange(name, event.target.value),
    };
  }
  return (
    <section
      id="catalog"
      className="catalog-section"
      aria-labelledby="section-title"
    >
      <button className="back-link" disabled={busy} onClick={() => onBack()}>
        <Arrow /> {editing ? "К карточке заказа" : "Вернуться к услугам"}
      </button>
      <h2 id="section-title">{editing ? "Изменить заказ" : "Детали заказа"}</h2>
      <p className="section-description">
        Укажите адрес и удобные интервалы забора и возврата.
      </p>
      <form id="order-form" ref={formRef} onSubmit={handleSubmit} noValidate>
        <fieldset disabled={busy}>
          <legend>Химчистка</legend>
          {editing ? (
            <p>{editing.point.name}</p>
          ) : (
            <label>
              Выберите точку
              <select {...field("pointId")} required>
                <option value="">Выберите химчистку</option>
                {points.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </fieldset>
        <fieldset disabled={busy}>
          <legend>
            <span>01</span> Контактные данные
          </legend>
          <div className="form-row">
            <label>
              Как к вам обращаться
              <input
                {...field("name")}
                autoComplete="name"
                placeholder="Ваше имя"
                maxLength={80}
                required
              />
            </label>
            <label>
              Телефон
              <input
                {...field("phone")}
                type="tel"
                autoComplete="tel"
                placeholder="+7 (999) 123-45-67"
                maxLength={30}
                required
              />
            </label>
          </div>
        </fieldset>
        <fieldset disabled={busy}>
          <legend>
            <span>02</span> Курьерский забор
          </legend>
          <label>
            Адрес в городе {catalog.city}
            <input
              {...field("address")}
              autoComplete="street-address"
              placeholder="Улица, дом, квартира, подъезд"
              maxLength={240}
              required
            />
          </label>
          <div className="form-row">
            <label>
              Дата забора
              <select {...field("date")} required>
                <option value="">Выберите день</option>
                {pickupOptions.map((date) => (
                  <option key={date} value={date}>
                    {dateLabel(date)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Удобное время
              <select {...field("slotId")} required>
                <option value="">Выберите интервал</option>
                {catalog.pickup.slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="field-hint">
            Время местное: {catalog.pickup.timeZone}.
          </p>
        </fieldset>
        <fieldset disabled={busy}>
          <legend>Возврат вещей</legend>
          <div className="form-row">
            <label>
              Дата возврата
              <select
                {...field("returnDate")}
                disabled={busy || !earliestReturn}
                required
              >
                <option value="">Выберите день</option>
                {returnOptions.map((date) => (
                  <option key={date} value={date}>
                    {dateLabel(date)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Интервал возврата
              <select {...field("returnSlotId")} required>
                <option value="">Выберите интервал</option>
                {catalog.pickup.slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>
        <fieldset disabled={busy}>
          <legend>
            <span>03</span> Пожелания <small>необязательно</small>
          </legend>
          <label>
            Комментарий к заказу
            <textarea
              {...field("note")}
              rows={3}
              maxLength={500}
              placeholder="Например, код домофона или особенности вещей"
            />
          </label>
          <span className="counter">{form.note.length} / 500</span>
        </fieldset>
      </form>
    </section>
  );
}
