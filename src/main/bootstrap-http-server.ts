import { HelloWorldController } from "../interface-adapters/controllers/http/hello-world-controller";
import { HTTP_VERBS } from "../interface-adapters/controllers/http/helpers";
import { ExpressHttpServerFactory } from "./express-http-server-factory";
import { FastifyHttpServerFactory } from "./fastify-http-server-factory";
import { HapiHttpServerFactory } from "./hapi-http-server";

// const httpServerFactory = new FastifyHttpServerFactory()
// const httpServerFactory = new HapiHttpServerFactory()
const httpServerFactory = new ExpressHttpServerFactory()
const httpServer = httpServerFactory.makeHttpServer()

httpServer.register(HTTP_VERBS.GET, '/hello/{:name}', new HelloWorldController())
httpServer.start(3000)
