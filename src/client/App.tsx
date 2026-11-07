import type { IOrderWorkflowProps } from "./types/index";
import { useState } from "react";

import { Arrow } from "./icons";
import { useCatalog } from "./useCatalog";
import { useOrder } from "./useOrder";
import { CheckoutForm } from "./components/CheckoutForm";
import { OrderReceipt } from "./components/OrderReceipt";
import { OrderSteps } from "./components/OrderSteps";
import { OrderSummary } from "./components/OrderSummary";
import { PageLayout } from "./components/PageLayout";
import { ServiceCatalog } from "./components/ServiceCatalog";
import { CustomerOrders } from "./components/CustomerOrders";

export function App() {
  const path = window.location.pathname;
  if (path === "/orders" || path.startsWith("/orders/")) {
    return <CustomerOrders id={path.slice("/orders/".length)} />;
  }
  return <CatalogPage />;
}

function CatalogPage() {
  const { state, reload } = useCatalog();
  if (state.status === "ready") {
    return <OrderWorkflow data={state.data} onRestart={reload} />;
  }
  return (
    <PageLayout catalog={null} step="services">
      <OrderSteps step="services" />
      {state.status === "loading" ? (
        <div className="loading-state" role="status">
          <span className="spinner" /> Загружаем услуги…
        </div>
      ) : (
        <div className="error-state" role="alert">
          <h2>Не получилось загрузить каталог</h2>
          <p>{state.message}</p>
          <button className="primary" onClick={reload}>
            Попробовать снова <Arrow />
          </button>
        </div>
      )}
    </PageLayout>
  );
}

function OrderWorkflow({ data, onRestart }: IOrderWorkflowProps) {
  const order = useOrder(
    data.catalog,
    data.points.length === 1 ? (data.points[0]?.id ?? "") : "",
  );
  const [category, setCategory] = useState("Все услуги");
  function showServices() {
    if (order.receipt) {
      onRestart();
      return;
    }
    order.goTo("services");
  }

  return (
    <PageLayout
      catalog={data.catalog}
      step={order.step}
      busy={order.busy}
      onServices={showServices}
    >
      <OrderSteps step={order.step} />
      {order.receipt ? (
        <OrderReceipt receipt={order.receipt} onNewOrder={onRestart} />
      ) : (
        <div className="content-grid">
          {order.step === "services" ? (
            <ServiceCatalog
              catalog={data.catalog}
              basket={order.basket}
              category={category}
              busy={order.busy}
              onCategoryChange={setCategory}
              onQuantityChange={order.changeQuantity}
            />
          ) : (
            <CheckoutForm
              data={data}
              form={order.form}
              busy={order.busy}
              error={order.error}
              onChange={order.changeField}
              onSubmit={order.submit}
              onBack={showServices}
            />
          )}
          <OrderSummary
            catalog={data.catalog}
            quote={order.quote}
            count={order.count}
            step={order.step}
            busy={order.busy}
            error={order.error}
            onCheckout={order.checkout}
          />
        </div>
      )}
    </PageLayout>
  );
}
