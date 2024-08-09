import { ExpressHttpServer } from "../../../frameworks-and-drivers/http-server/express-http-server";
import { HttpServer } from "../../../frameworks-and-drivers/http-server/http-server";
import { HttpServerFactory } from "./http-server-factory";

export class ExpressHttpServerFactory implements HttpServerFactory {
  makeHttpServer(): HttpServer {
    return new ExpressHttpServer()
  }

}