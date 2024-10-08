export enum HTTP_VERBS {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}

export enum HTTP_STATUS_CODE {
  OK = 200,
  CREATED = 201,
  UNAUTHORIZED = 401,
  BAD_REQUEST = 400,
  SERVER_ERROR = 500
}

export interface HttpResponse<T = any> {
  body?: T
  statusCode: number
}

export function ok<T> (body: T): HttpResponse {
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


export interface HttpCallback {
  (body: any, params: any, query: any, headers: any): Promise<HttpResponse>
}