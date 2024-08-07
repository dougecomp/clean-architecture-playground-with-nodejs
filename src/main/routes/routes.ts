import { HttpServer } from "../../frameworks-and-drivers/http-server/http-server";
import { HelloWorldController } from "../../interface-adapters/controllers/hello-world-controller";
import { HTTP_VERBS } from "../../interface-adapters/http/helpers";

export function setupRoutes (httpServer: HttpServer) {
  httpServer.registerController({
    method: HTTP_VERBS.GET,
    route: '/hello-world',
    controller: new HelloWorldController()
  })
}