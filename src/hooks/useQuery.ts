import { useEffect, useState } from "react";

type UseQuery<TQueryFn extends () => Promise<unknown>> = {
  queryFn: TQueryFn;
};

type UseQueryReturn<TQueryFn extends () => Promise<unknown>> = {
  data: Awaited<ReturnType<TQueryFn> | null>;
  error: unknown;
  loading: boolean;
};

export const useQuery = <TQueryFn extends () => Promise<unknown>>({
  queryFn,
}: UseQuery<TQueryFn>): UseQueryReturn<TQueryFn> => {
  const [data, setData] = useState<UseQueryReturn<TQueryFn>["data"]>(null);
  const [error, setError] = useState<UseQueryReturn<TQueryFn>["error"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = (await queryFn()) as UseQueryReturn<TQueryFn>["data"];
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, error, loading };
};
