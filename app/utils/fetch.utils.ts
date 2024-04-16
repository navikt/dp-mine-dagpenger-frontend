export type INetworkResponse<T = void> = INetworkResponseSuccess<T> | INetworkResponseError;

interface INetworkResponseSuccess<T> {
  status: "success";
  data?: T;
  id?: string;
}

interface INetworkResponseError {
  status: "error";
  error: {
    statusCode: number;
    statusText: string;
  };
  id?: string;
}

export function getHeaders(onBehalfOfToken: string) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${onBehalfOfToken}`,
  };

  return headers;
}
