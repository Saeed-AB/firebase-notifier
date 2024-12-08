import axios, { AxiosResponse } from "axios";
import { SubscribeDataT, Topics } from "../sharedTypes";

export const getTopics = async (
  firebaseToken: string
): Promise<
  AxiosResponse<{ topics: Topics }, { error: "Something went wrong!" }>
> => {
  const authToken = localStorage.getItem("user_token") ?? "";
  const params = {
    firebaseToken,
    authToken,
  };

  const queries = new URLSearchParams(params).toString();
  return axios.get(`/api/topics?${queries}`);
};

export const handleSubscribeUnSubscribe = async (
  variables: SubscribeDataT
): Promise<
  AxiosResponse<{ topics: Topics }, { error: "Something went wrong!" }>
> => {
  const authToken = localStorage.getItem("user_token") ?? "";

  return await axios.post(`/api/topics`, {
    authToken,
    ...variables,
  });
};
