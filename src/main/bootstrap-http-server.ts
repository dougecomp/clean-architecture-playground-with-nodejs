/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExpressHttpServerFactory } from "./factories/http-server/express-http-server-factory";
import { FastifyHttpServerFactory } from "./factories/http-server/fastify-http-server-factory";
import { HapiHttpServerFactory } from "./factories/http-server/hapi-http-server";
import { setupRoutes } from "./routes/routes";

const httpServerFactory = new ExpressHttpServerFactory()
// const httpServerFactory = new FastifyHttpServerFactory()
// const httpServerFactory = new HapiHttpServerFactory()
const httpServer = httpServerFactory.makeHttpServer()

setupRoutes(httpServer)

httpServer.start(3000)
