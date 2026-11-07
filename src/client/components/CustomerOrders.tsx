import { useEffect, useState } from "react";
import { getCatalog, getOrder, getOrders, getSession, logout } from "../api";
import { Drop } from "../icons";
import type { ICustomerOrder } from "../../shared/types/customer-order";
import type { ICatalogResponse } from "../../shared/types/index";
import type {
  ICustomerOrdersProps,
  TOrdersView,
} from "../types/customer-orders";
import { orderError } from "../utils/errors";
import { dateLabel, money } from "../utils/format";
import { CustomerOrderEditor } from "./CustomerOrderEditor";

export function CustomerOrders({ id }: ICustomerOrdersProps) {
  const [view, setView] = useState<TOrdersView>({ status: "loading" });
  const [editing, setEditing] = useState<ICatalogResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    async function load() {
      try {
        const session = await getSession(signal);
        if (!session.authenticated) {
          setView({ status: "guest", loginAvailable: session.loginAvailable });
        } else if (id) {
          setView({ status: "detail", order: await getOrder(id, signal) });
        } else {
          setView({ status: "list", orders: await getOrders(signal) });
        }
      } catch (cause: unknown) {
        if (!signal.aborted) {
          setView({ status: "failed", message: orderError(cause).message });
        }
      }
    }
    void load();
    return () => controller.abort();
  }, [id, reload]);

  async function signOut() {
    setBusy(true);
    setError("");
    try {
      await logout();
      location.assign("/orders");
    } catch (cause: unknown) {
      setError(orderError(cause).message);
      setBusy(false);
    }
  }

  async function edit() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      setEditing(await getCatalog(new AbortController().signal));
    } catch (cause: unknown) {
      setError(orderError(cause).message);
    } finally {
      setBusy(false);
    }
  }

  function saved(order: ICustomerOrder) {
    setEditing(null);
    setView({ status: "detail", order });
    setMessage("Изменения сохранены.");
  }

  function refresh() {
    setView({ status: "loading" });
    setReload((value) => value + 1);
  }

  const signedIn = view.status === "list" || view.status === "detail";
  const returnTo = id ? `/orders/${id}` : "/orders";
  return (
    <>
      <a className="skip-link" href="#main">
        К содержимому
      </a>
      <header className="site-header account-header">
        <div className="header-inner">
          <a
            className="brand"
            href="/"
            aria-label="Clean Connect, к выбору услуг"
          >
            <span className="brand-icon">
              <Drop />
            </span>
            Clean Connect<span className="brand-dot">.</span>
          </a>
          <nav className="header-actions" aria-label="Главная навигация">
            <a className="orders-link account-services-link" href="/">
              Услуги
            </a>
            {signedIn && (
              <button
                className="orders-link"
                type="button"
                disabled={busy}
                onClick={() => void signOut()}
              >
                Выйти
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="page orders-page" id="main">
        {id && (
          <a className="back-link" href="/orders">
            Все заказы
          </a>
        )}
        <h1>
          {view.status === "detail"
            ? `Заказ ${view.order.number}`
            : "Мои заказы"}
        </h1>
        {message && (
          <p className="field-hint" role="status">
            {message}
          </p>
        )}
        {error && (
          <p className="error-state" role="alert">
            {error}
          </p>
        )}
        {view.status === "loading" && <p role="status">Загружаем заказы…</p>}
        {view.status === "failed" && (
          <div className="error-state" role="alert">
            <p>{view.message}</p>
            <button className="secondary" type="button" onClick={refresh}>
              Попробовать снова
            </button>
          </div>
        )}
        {view.status === "guest" && (
          <section className="catalog-section orders-panel">
            <h2>Войдите в личный кабинет</h2>
            <p>Используйте email, с которым оформляли заказ.</p>
            {new URLSearchParams(location.search).get("login") === "failed" && (
              <p className="error-state" role="alert">
                Войти не удалось. Попробуйте ещё раз.
              </p>
            )}
            {view.loginAvailable ? (
              <a
                className="primary"
                href={`/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`}
              >
                Войти по коду на email
              </a>
            ) : (
              <p>Вход по email пока не настроен.</p>
            )}
          </section>
        )}
        {view.status === "list" &&
          (view.orders.length ? (
            <ul className="orders-list" aria-label="Ваши заказы">
              {view.orders.map((order) => (
                <li key={order.id}>
                  <a href={`/orders/${order.id}`} className="order-row">
                    <span>
                      <strong>{order.number}</strong>
                      <span>{order.point.name}</span>
                    </span>
                    <span>
                      <span className="status-badge">{order.statusLabel}</span>
                    </span>
                    <strong>{money(order.quote.totalKopecks)}</strong>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <section className="catalog-section orders-panel">
              <h2>Заказов пока нет</h2>
              <p>После оформления заказ появится здесь.</p>
              <a className="primary" href="/">
                Выбрать услуги
              </a>
            </section>
          ))}
        {view.status === "detail" &&
          (editing ? (
            <CustomerOrderEditor
              order={view.order}
              data={editing}
              onBack={() => setEditing(null)}
              onSaved={saved}
            />
          ) : (
            <section
              className="catalog-section orders-panel"
              aria-label="Детали заказа"
            >
              <span className="status-badge">{view.order.statusLabel}</span>
              <dl className="order-details">
                <div>
                  <dt>Химчистка</dt>
                  <dd>{view.order.point.name}</dd>
                </div>
                <div>
                  <dt>Адрес</dt>
                  <dd>{view.order.order.customer.address}</dd>
                </div>
                <div>
                  <dt>Забор</dt>
                  <dd>
                    {dateLabel(view.order.pickup.date)},{" "}
                    {view.order.pickup.slotLabel}
                  </dd>
                </div>
                <div>
                  <dt>Возврат</dt>
                  <dd>
                    {dateLabel(view.order.returnSlot.date)},{" "}
                    {view.order.returnSlot.slotLabel}
                  </dd>
                </div>
                <div>
                  <dt>Услуги</dt>
                  <dd>
                    {view.order.quote.lines
                      .map(({ name, quantity }) => `${name} × ${quantity}`)
                      .join(", ")}
                  </dd>
                </div>
                <div>
                  <dt>Итого</dt>
                  <dd>{money(view.order.quote.totalKopecks)}</dd>
                </div>
              </dl>
              {view.order.status === "new" ? (
                <button
                  className="primary"
                  type="button"
                  disabled={busy}
                  onClick={() => void edit()}
                >
                  {busy ? "Загружаем…" : "Изменить заказ"}
                </button>
              ) : (
                <p>
                  Чтобы изменить заказ, свяжитесь с химчисткой.{" "}
                  <a href={`tel:${view.order.point.phone}`}>
                    {view.order.point.phone}
                  </a>
                </p>
              )}
            </section>
          ))}
      </main>
    </>
  );
}
