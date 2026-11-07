import type { ICatalogResponse } from "../../shared/types/index";

export type TCatalogState =
  | { status: "loading" }
  | { status: "ready"; data: ICatalogResponse }
  | { status: "error"; message: string };
