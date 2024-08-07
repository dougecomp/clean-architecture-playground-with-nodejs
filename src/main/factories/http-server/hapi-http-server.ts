import { HapiHttpServer } from "../../../frameworks-and-drivers/http-server/hapi-http-server";
import { HttpServer } from "../../../frameworks-and-drivers/http-server/http-server";
import { HttpServerFactory } from "./http-server-factory";

export class HapiHttpServerFactory implements HttpServerFactory {
  makeHttpServer(): HttpServer {
    return new HapiHttpServer()
  }

}