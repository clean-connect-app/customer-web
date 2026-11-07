import type { ReactNode } from "react";
import type {
  IBasketItem,
  ICatalog,
  ICatalogResponse,
  IQuote,
} from "../../shared/types/index";
import type { ICustomerOrder } from "../../shared/types/customer-order";
import type { InputError } from "../../shared/utils/input-error";
import type { IOrderFormValues, TOrderStep } from "./order";

export interface IOrderWorkflowProps {
  data: ICatalogResponse;
  onRestart: () => void;
}

export interface ICheckoutFormProps {
  data: ICatalogResponse;
  form: IOrderFormValues;
  editing?: ICustomerOrder;
  busy: boolean;
  error: InputError | null;
  onChange: (field: keyof IOrderFormValues, value: string) => void;
  onSubmit: () => Promise<void>;
  onBack: () => void;
}

export interface IOrderReceiptProps {
  receipt: ICustomerOrder;
  onNewOrder: () => void;
}

export interface IOrderStepsProps {
  step: TOrderStep;
}

export interface IOrderSummaryProps {
  catalog: ICatalog;
  quote: IQuote | null;
  count: number;
  step: TOrderStep;
  busy: boolean;
  error: InputError | null;
  onCheckout: () => Promise<void>;
}

export interface IPageLayoutProps {
  catalog: ICatalog | null;
  step: TOrderStep;
  busy?: boolean;
  onServices?: () => void;
  children: ReactNode;
}

export interface IQuantityControlProps {
  serviceId: string;
  quantity: number;
  name: string;
  max: boolean;
  disabled: boolean;
  onChange: (id: string, delta: number) => void;
}

export interface IServiceCatalogProps {
  catalog: ICatalog;
  basket: IBasketItem[];
  category: string;
  busy: boolean;
  onCategoryChange: (category: string) => void;
  onQuantityChange: (id: string, delta: number) => void;
}
