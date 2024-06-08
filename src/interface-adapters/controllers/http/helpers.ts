import { HttpResponse } from "./http-controller";

export function ok (body: any): HttpResponse {
  return {
    statusCode: 200,
    body
  }
}

export function serverError (): HttpResponse {
  return {
    statusCode: 500,
    body: new Error('internal server error')
  }
}

export enum HTTP_VERBS {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}