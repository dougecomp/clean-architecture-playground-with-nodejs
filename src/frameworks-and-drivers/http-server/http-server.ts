import { Server } from 'node:http'

import { HTTP_VERBS } from "../../interface-adapters/controllers/http/helpers"
import { HttpController, HttpResponse } from "../../interface-adapters/controllers/http/http-controller"

export interface HttpServer {
  registerController(method: HTTP_VERBS, route: string, controller: HttpController): Promise<void>
  registerCallback(method: HTTP_VERBS, route: string, callback: (body: any, params: any, query: any, headers: any) => Promise<HttpResponse>): void
  start(port: number): Promise<Server>
}