/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExpressHttpServerFactory } from "@/main/factories/http-server/express-http-server-factory";
import { FastifyHttpServerFactory } from "@/main/factories/http-server/fastify-http-server-factory";
import { HapiHttpServerFactory } from "@/main/factories/http-server/hapi-http-server";
import { setupRoutes } from "@/main/routes/routes";

const httpServerFactory = new ExpressHttpServerFactory()
// const httpServerFactory = new FastifyHttpServerFactory()
// const httpServerFactory = new HapiHttpServerFactory()
const httpServer = httpServerFactory.makeHttpServer()

setupRoutes(httpServer)

httpServer.start(3000)
