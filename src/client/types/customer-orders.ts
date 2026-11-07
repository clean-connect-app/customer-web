import type { ICustomerOrder } from "../../shared/types/customer-order";
import type { ICatalogResponse } from "../../shared/types/index";

export type TOrdersView =
  | { status: "loading" }
  | { status: "guest"; loginAvailable: boolean }
  | { status: "failed"; message: string }
  | { status: "list"; orders: ICustomerOrder[] }
  | { status: "detail"; order: ICustomerOrder };

export interface ICustomerOrderEditorProps {
  order: ICustomerOrder;
  data: ICatalogResponse;
  onBack: () => void;
  onSaved: (order: ICustomerOrder) => void;
}

export interface ICustomerSession {
  authenticated: boolean;
  loginAvailable: boolean;
}

export interface ICustomerOrdersProps {
  id: string;
}
