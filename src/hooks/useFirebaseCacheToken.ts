"use client";
const tokenKey = "firebase_token";
const auth2TokenKey = "user_token";

const useFirebaseCacheToken = () => {
  const getToken = () => {
    return localStorage.getItem(tokenKey);
  };

  const getAuth2Token = () => {
    return localStorage.getItem(auth2TokenKey);
  };

  const setToken = (token: string) => {
    localStorage.setItem(tokenKey, token);
  };

  const setAuth2Token = (token: string) => {
    localStorage.setItem(auth2TokenKey, token);
  };

  const deleteToken = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(auth2TokenKey);
  };

  return {
    getToken,
    getAuth2Token,
    setToken,
    setAuth2Token,
    deleteToken,
  };
};

export default useFirebaseCacheToken;
