import { HTTP_VERBS } from "@/interface-adapters/http/helpers";
import { HttpServer } from "@/frameworks-and-drivers/http-server/http-server";
import { makeHelloWorldController } from "@/main/factories/controllers/hello-world-factory";

export function setupRoutes (httpServer: HttpServer) {
  httpServer.registerController({
    method: HTTP_VERBS.GET,
    route: '/hello-world/:name',
    controller: makeHelloWorldController()
  })
}