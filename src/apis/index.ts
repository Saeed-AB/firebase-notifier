"use server";
import { SubscribeDataT, Topics } from "../sharedTypes";
import { apiRequest } from "../utils/apiHandler";

export const getTopics = async (token: string) => {
  const response = await apiRequest<{ rel: { topics: Topics } }>({
    method: "GET",
    url: `https://iid.googleapis.com/iid/info/${token}?details=true`,
  });

  return response.data?.rel?.topics ?? {};
};

export const handleSubscribeUnSubscribe = async (variables: SubscribeDataT) => {
  return apiRequest<{ message: string }>({
    method: variables.method,
    url: `https://iid.googleapis.com/iid/v1/${variables.token}/rel/topics/${variables.topic}`,
  })
    .then((res) => ({ status: res?.status, data: res?.data }))
    .catch((error) => ({
      status: error?.response?.status,
      errorMessage: error?.response?.data?.error || error?.message,
    }));
};
