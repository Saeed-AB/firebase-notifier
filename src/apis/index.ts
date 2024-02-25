import { SubscribeDataT, Topics } from "../sharedTypes";
import { apiRequest, handleApiError } from "../utils/apiHandler";

export const getTopics = async (t: string) => {
  try {
    const response = await apiRequest<Topics>({
      method: "GET",
      url: "get_topics",
      params: {
        token: t,
      },
    });

    return response.data;
  } catch (e) {
    handleApiError(e);
  }
};

export const handleSubscribeUnSubscribe = async (variables: SubscribeDataT) => {
  return apiRequest<{ message: string }>({
    method: "PUT",
    url: "topic_methods",
    data: {
      token: variables.token,
      method: variables.method,
      topic: variables.topic,
    },
  });
};
