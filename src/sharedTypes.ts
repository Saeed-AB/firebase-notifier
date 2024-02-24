export type Topics = {
  [K: string]: { [K: string]: string };
};

export type MethodT = "Subscribe" | "UnSubscribe";

export type FirebaseStatusT = {
  status: "success" | "rejected" | "pending";
  token: string | null;
  errorMessage?: string;
};

export enum Stores {
  FirebaseData = "firebase",
}

export type NotificationStateT = {
  showModal: boolean;
  data: Record<string, unknown> | null;
}