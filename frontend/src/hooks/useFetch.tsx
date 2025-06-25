import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

const useFetch = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getdata = async () => {
      try {
        const { data } = await axiosInstance.get(url);
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setError(error as Error);
        setLoading(false);
        setData(null);
      }
    };
    axiosInstance;
    getdata();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
