import { SubscribeDataT, Topics } from "../sharedTypes";
import { apiRequest, handleApiError } from "../utils/apiHandler";

export const getTopics = async (token: string) => {
  try {
    const response = await apiRequest<{ rel: { topics: Topics } }>({
      method: "GET",
      url: `https://iid.googleapis.com/iid/info/${token}?details=true`,
    });

    return response.data?.rel?.topics ?? {};
  } catch (e) {
    handleApiError(e);
  }
};

export const handleSubscribeUnSubscribe = async (variables: SubscribeDataT) => {
  try {
    return apiRequest<{ message: string }>({
      method: variables.method,
      url: `https://iid.googleapis.com/iid/v1/${variables.token}/rel/topics/${variables.topic}`,
    });
  } catch (e) {
    handleApiError(e);
  }
};
