export type INetworkResponse<T = void> =
  | INetworkResponseSuccess<T>
  | INetworkResponseError
  | INetworkResponseLoading;

export interface INetworkResponseSuccess<T> {
  status: "success";
  id?: string;
  data?: T;
}
export interface INetworkResponseError {
  status: "error";
  error: {
    statusCode: number;
    statusText: string;
  };
  id?: string;
}

export interface INetworkResponseLoading {
  status: "waiting";
}
