export type Topics = {
  [K: string]: { [K: string]: string };
};

export type MethodT = "Subscribe" | "UnSubscribe";

export type FirebaseStatusT = {
  status: "success" | "rejected" | "pending";
  token: string | null;
  errorMessage?: string;
};

export type NotificationStateT = {
  showModal: boolean;
  data: Record<string, unknown> | null;
};

export type SubscribeDataT = {
  token: string;
  method: string;
  topic: string;
};
