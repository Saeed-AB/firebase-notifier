export type Topics = {
  [K: string]: { [K: string]: string };
};

export type MethodT = "Subscribe" | "UnSubscribe";

export type SubscribeDataT = {
  token: string;
  method: string;
  topic: string;
};

export type FiltersStateT = {
  method: MethodT
  search: string
}
