import { ExpressHttpServer } from "../frameworks-and-drivers/http-server/express-http-server";
import { HttpServer } from "../frameworks-and-drivers/http-server/http-server";
import { HapiHttpServerFactory } from "./hapi-http-server";

export class ExpressHttpServerFactory implements HapiHttpServerFactory {
  makeHttpServer(): HttpServer {
    return new ExpressHttpServer()
  }

}