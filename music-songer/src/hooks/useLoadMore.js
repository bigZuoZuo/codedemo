import { useEffect, useState, useRef, useCallback } from "react";
import { isFunction } from "@src/lib/utils";

export const useLoadMore = (loadData, bottomRef) => {
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const [end, setEnd] = useState(0);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [observer, setObserver] = useState(null);

  // TODO 加个total去掉多余请求
  const action = useCallback(
    async (isRefresh) => {
      if (!isFunction(loadData) || !hasMoreRef.current) {
        setIsLoading(false);
        return;
      }

      try {
        const _list = await loadData(pageRef.current);
        hasMoreRef.current = !!_list.length;

        setList((sources) => {
          const res = (isRefresh ? [] : sources).concat(_list);
          setEnd(res.length);

          return res;
        });
      } catch (err) {}

      setIsLoading(false);
    },
    [loadData]
  );

  const refresh = useCallback(async () => {
    pageRef.current = 1;
    hasMoreRef.current = true;
    action(true);
  }, [action]);

  const callback = (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting && hasMoreRef.current) {
        pageRef.current += 1;
        action();
      }
    });
  };

  const intiateScrollObserver = () => {
    try {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      };
      const Observer = new IntersectionObserver(callback, options);
      if (bottomRef.current) {
        Observer.observe(bottomRef.current);
      }
      setObserver(Observer);
    } catch (err) {
    }
  };

  const resetObservation = () => {
    if (bottomRef.current && observer) {
      observer.unobserve(bottomRef.current);
    }
  };

  useEffect(() => {
    intiateScrollObserver();

    return () => {
      resetObservation();
    };
  }, [end, isLoading]);

  useEffect(() => {
    action();
  }, []);

  return [list, refresh];
};
