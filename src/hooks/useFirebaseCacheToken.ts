const tokenKey = "firebase_token";

const useFirebaseCacheToken = () => {
  const getToken = () => {
    return localStorage.getItem(tokenKey);
  };

  const setToken = (token: string) => {
    localStorage.setItem(tokenKey, token);
  };

  const deleteToken = () => {
    localStorage.removeItem(tokenKey);
  };

  return {
    getToken,
    setToken,
    deleteToken,
  };
};

export default useFirebaseCacheToken;
