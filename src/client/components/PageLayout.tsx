import type { IPageLayoutProps } from "../types/index";

import { Drop, Pin, Truck } from "../icons";
import { money } from "../utils/format";

export function PageLayout({
  catalog,
  step,
  busy = false,
  onServices,
  children,
}: IPageLayoutProps) {
  function showServices() {
    if (!busy && step !== "services") {
      onServices?.();
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">
        К содержимому
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href="#main"
            onClick={showServices}
            aria-label="Clean Connect, к выбору услуг"
          >
            <span className="brand-icon">
              <Drop />
            </span>
            Clean Connect<span className="brand-dot">.</span>
          </a>
          <nav className="desktop-nav" aria-label="Главная навигация">
            <a href="#catalog" onClick={showServices}>
              Услуги и цены
            </a>
            <a href="#how-it-works">Как это работает</a>
            <a href="#questions">Вопросы</a>
          </nav>
          <div className="header-actions">
            <a className="orders-link" href="/orders">
              Мои заказы
            </a>
            <span className="city">
              <Pin /> {catalog?.city ?? "Екатеринбург"}
            </span>
          </div>
        </div>
      </header>

      <main id="main" className="page">
        <div className="breadcrumb">
          Главная <span>/</span> <span>Химчистка с доставкой</span>
        </div>
        <div className="page-heading">
          <div>
            <div className="eyebrow">
              <span /> БОЛЬШЕ ВРЕМЕНИ ДЛЯ ЖИЗНИ
            </div>
            <h1>
              Чистые вещи.
              <br />
              <span>Без лишних забот.</span>
            </h1>
            <p>
              Выберите услуги, остальное мы берём на себя.
              <br className="desktop-break" /> Заберём, бережно почистим и
              привезём обратно.
            </p>
          </div>
          <div className="hero-note">
            <span className="note-icon">
              <Truck />
            </span>
            <div>
              <strong>От двери до двери</strong>
              <span>Забор и возврат одним курьерским сервисом</span>
            </div>
          </div>
        </div>

        {children}
        <section id="how-it-works" className="how-section">
          <div className="eyebrow">ПРОСТО, КАК РАЗ, ДВА, ТРИ</div>
          <h2>Чистота без похода в химчистку</h2>
          <div className="how-grid">
            <article>
              <span>01</span>
              <h3>Вы выбираете</h3>
              <p>Добавьте вещи в заказ и укажите удобное время забора.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Мы заботимся</h3>
              <p>
                Курьер забирает вещи, а специалисты подбирают подходящий уход.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Вещи возвращаются</h3>
              <p>Доставим чистые вещи в выбранный интервал.</p>
            </article>
          </div>
        </section>
        <section id="questions" className="faq">
          <h2>Остались вопросы?</h2>
          <details>
            <summary>Что входит в стоимость доставки?</summary>
            <p>
              Тариф включает курьерский забор и возврат вещей по одному адресу в
              городе {catalog?.city ?? "Екатеринбург"}. Доставка стоит{" "}
              {money(catalog?.delivery.feeKopecks ?? 39900)}, а от{" "}
              {money(catalog?.delivery.freeFromKopecks ?? 300000)} стоимости
              услуг бесплатно.
            </p>
          </details>
          <details>
            <summary>Когда можно передать вещи курьеру?</summary>
            <p>
              Доступны даты с завтрашнего дня на ближайшие{" "}
              {catalog?.pickup.daysAhead ?? 14} дней. Оба интервала выбираются
              при оформлении.
            </p>
          </details>
          <details>
            <summary>Когда нужно оплатить заказ?</summary>
            <p>
              Оплата после оказания услуги. Стоимость выбранных услуг, забора и
              доставки отображается в заказе до его оформления.
            </p>
          </details>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <span className="brand footer-brand">
            <Drop small /> Clean Connect.
          </span>
          <p>Химчистка с забором и доставкой вещей</p>
        </div>
      </footer>
    </>
  );
}
