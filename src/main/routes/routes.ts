import { HttpServer } from "../../frameworks-and-drivers/http-server/http-server";
import { HelloWorldController } from "../../interface-adapters/controllers/http/hello-world-controller";
import { HTTP_VERBS } from "../../interface-adapters/controllers/http/helpers";

export function setupRoutes (httpServer: HttpServer) {
  httpServer.register(HTTP_VERBS.GET, '/hello/{:name}', new HelloWorldController())
}