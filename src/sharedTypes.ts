export type Topics = {
  [K: string]: { [K: string]: string };
};

export type SubscribeDataT = {
  token: string;
  method: string;
  topic: string;
};

export type FiltersStateT = {
  search: string
}
