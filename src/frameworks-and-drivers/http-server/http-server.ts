import { HTTP_VERBS } from "../../interface-adapters/controllers/http/helpers"
import { HttpController } from "../../interface-adapters/controllers/http/http-controller"

export interface HttpServer {
  register(method: HTTP_VERBS, route: string, controller: HttpController): Promise<void>
  start(port: number): Promise<void>
}