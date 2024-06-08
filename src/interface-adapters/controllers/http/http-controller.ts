export interface HttpResponse<T = any> {
  body?: T
  statusCode: number
}

export interface HttpController<T = any, U = any> {
  handle: (request: T) => Promise<HttpResponse<U>>
}