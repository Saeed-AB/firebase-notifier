'use client'
import axios, { AxiosError } from "axios";
import useFirebaseCacheToken from "./useFirebaseCacheToken";
import toast from "react-hot-toast";
import { useState } from "react";

const useGetAuth2Token = (args?: { callback: () => void }) => {
  const { setAuth2Token } = useFirebaseCacheToken();
  const [isAuth2Initializing, setIsAuth2Initializing] = useState(false);

  const getAuth = async () => {
    setIsAuth2Initializing(true);
    try {
      const response = await axios.get(`/api/auth`);
      const authToken = response.data.authToken;
      setAuth2Token(authToken);
      setIsAuth2Initializing(false);
      args?.callback();
    } catch (e) {
      setIsAuth2Initializing(false);
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.error || e.message);
      }
    }
  };

  return {
    isAuth2Initializing,
    getAuth,
  };
};

export default useGetAuth2Token;
