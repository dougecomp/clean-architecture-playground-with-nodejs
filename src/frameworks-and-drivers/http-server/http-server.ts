import { Server } from 'node:http'

import { HTTP_VERBS, HttpResponse } from "../../interface-adapters/controllers/http/helpers"
import { HttpController } from "../../interface-adapters/controllers/http/http-controller"

export interface HttpCallback {
  (body: any, params: any, query: any, headers: any): Promise<HttpResponse>
}

export interface RegisterControllerInput {
  method: HTTP_VERBS,
  route: string,
  controller: HttpController,
  preController?: HttpController
}

export interface RegisterCallbackV2 {
  method: HTTP_VERBS,
  route: string,  
  callback: HttpCallback
  preCallback?: HttpCallback
}

export interface HttpServer {
  registerController(input: RegisterControllerInput): void
  registerCallback(input: RegisterCallbackV2): void
  start(port: number): Promise<Server>
}