import { FastifyHttpServer } from "@/frameworks-and-drivers/http-server/fastify-http-server";
import { HttpServer } from "@/frameworks-and-drivers/http-server/http-server";

import { HttpServerFactory } from "./http-server-factory";

export class FastifyHttpServerFactory implements HttpServerFactory {
  makeHttpServer(): HttpServer {
    return new FastifyHttpServer()
  }

}