import { HttpServer } from "../frameworks-and-drivers/http-server/http-server";

export interface HttpServerFactory {
  makeHttpServer(): HttpServer
}