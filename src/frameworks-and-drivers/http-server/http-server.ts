import { Server } from 'node:http'

import { HTTP_VERBS, HttpResponse } from "../../interface-adapters/controllers/http/helpers"
import { HttpController } from "../../interface-adapters/controllers/http/http-controller"

export interface HttpCallback {
  (body: any, params: any, query: any, headers: any): Promise<HttpResponse>
}

export interface HttpServer {
  registerController(method: HTTP_VERBS, route: string, controller: HttpController): void
  registerCallback(method: HTTP_VERBS, route: string, callback: HttpCallback): void
  start(port: number): Promise<Server>
}