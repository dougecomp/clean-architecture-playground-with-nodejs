import { HttpServer } from "../../frameworks-and-drivers/http-server/http-server";
import { HelloWorldController } from "../../interface-adapters/controllers/http/hello-world-controller";
import { HTTP_VERBS } from "../../interface-adapters/controllers/http/helpers";
import { XPTOController } from "../../interface-adapters/controllers/http/xpto-controller";

export function setupRoutes (httpServer: HttpServer) {
  httpServer.registerController({
    method: HTTP_VERBS.GET,
    route: '/hello-world',
    controller: new HelloWorldController()
  })
  new XPTOController(httpServer)
}