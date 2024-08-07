import { Server } from 'node:http'

import { Controller } from '../../interface-adapters/controllers/controller'
import { HTTP_VERBS } from "../../interface-adapters/http/helpers"

export interface RegisterControllerInput {
  method: HTTP_VERBS,
  route: string,
  controller: Controller
}

export interface HttpServer {
  registerController(input: RegisterControllerInput): void
  start(port: number): Promise<Server>
}