import { ExpressHttpServerFactory } from "./express-http-server-factory";
import { FastifyHttpServerFactory } from "./fastify-http-server-factory";
import { HapiHttpServerFactory } from "./hapi-http-server";
import { setupRoutes } from "./routes/routes";

// const httpServerFactory = new FastifyHttpServerFactory()
// const httpServerFactory = new HapiHttpServerFactory()
const httpServerFactory = new ExpressHttpServerFactory()
const httpServer = httpServerFactory.makeHttpServer()

setupRoutes(httpServer)

httpServer.start(3000)
