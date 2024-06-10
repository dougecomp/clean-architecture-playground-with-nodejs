import { HttpResponse } from "./helpers";

export interface HttpController<T = any, U = any> {
  handle: (request: T) => Promise<HttpResponse<U>>
}