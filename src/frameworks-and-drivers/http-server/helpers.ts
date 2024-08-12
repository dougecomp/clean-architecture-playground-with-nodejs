import { ServerError } from "../../interface-adapters/errors/server-error";
import { UnauthorizedError } from "../../interface-adapters/errors/unathorized-error";
import { HTTP_STATUS_CODE, HTTP_VERBS } from "../../interface-adapters/http/helpers";

type ExtractHttpResponse = {
  error: any
  data: any
  method?: HTTP_VERBS
}

export function extractHttpResponse (input: ExtractHttpResponse) {
  const {error, data, method} = input
  if (error instanceof ServerError) {
    return {
      body: error,
      statusCode: HTTP_STATUS_CODE.SERVER_ERROR
    }
  }
  if (error instanceof UnauthorizedError) {
    return {
      body: error,
      statusCode: HTTP_STATUS_CODE.UNAUTHORIZED
    }
  }
  if (error instanceof Error) {
    return {
      body: error,
      statusCode: HTTP_STATUS_CODE.BAD_REQUEST
    }
  }
  if (method === 'post') {
    return {
      body: data,
      statusCode: HTTP_STATUS_CODE.CREATED
    }
  }
  return {
    body: data,
    statusCode: HTTP_STATUS_CODE.OK
  }
}

// export function extract