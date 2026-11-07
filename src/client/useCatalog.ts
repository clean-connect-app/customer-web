import type { TCatalogState } from "./types/index";
import { useEffect, useState } from "react";

import { getCatalog } from "./api";

export function useCatalog() {
  const [state, setState] = useState<TCatalogState>({ status: "loading" });
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    void getCatalog(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ status: "ready", data });
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        const timedOut =
          error instanceof DOMException && error.name === "TimeoutError";
        setState({
          status: "error",
          message: timedOut
            ? "Сервер не ответил вовремя. Попробуйте загрузить каталог снова."
            : "Каталог пока недоступен. Попробуйте загрузить его снова.",
        });
      });
    return () => controller.abort();
  }, [revision]);

  function reload() {
    setState({ status: "loading" });
    setRevision((value) => value + 1);
  }

  return { state, reload };
}
