import { expiresIn, getToken, validateToken } from "@navikt/oasis";
import { getEnv } from "~/utils/env.utils";
import { INetworkResponse } from "~/models/networkResponse";

export interface ISessionData {
  expiresIn: number;
}

export async function getSession(req: Request): Promise<INetworkResponse<ISessionData>> {
  const devToken = getEnv("DP_INNSYN_TOKEN");

  if (getEnv("IS_LOCALHOST") === "true" && getEnv("USE_MSW") === "false" && devToken) {
    if (expiresIn(devToken) <= 0) {
      console.log("\n ⛔️ Lokalt sessjon utløpt! Kjør: npm run generate-token på nytt.");

      return {
        status: "error",
        error: {
          statusCode: 401,
          statusText: "Expired token",
        },
      };
    }

    return {
      status: "success",
      data: {
        expiresIn: expiresIn(devToken),
      },
    };
  }

  const token = getToken(req);

  if (!token) {
    return {
      status: "error",
      error: {
        statusCode: 401,
        statusText: "Token not found",
      },
    };
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    return {
      status: "error",
      error: {
        statusCode: 401,
        statusText: "Invalid token",
      },
    };
  }

  return {
    status: "success",
    data: {
      expiresIn: expiresIn(token),
    },
  };
}
