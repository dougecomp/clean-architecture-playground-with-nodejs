import {Server, server} from '@hapi/hapi'

import { HttpController } from "../../interface-adapters/controllers/http/http-controller";
import { HttpServer } from "./http-server";

export class HapiHttpServer implements HttpServer {
  private httpServer: Server

  constructor () {
    this.httpServer = server({
      debug: {
        log: 'debug'
      }
    })
  }

  async register(method: string, route: string, controller: HttpController<any, any>): Promise<void> {
    this.httpServer.route({
      method: method as any,
      path: route.replace(/\:/g, ""),
      handler: async (request, response) => {
        const httpResponse = await controller.handle({
          ...request.payload as any,
          ...request.params,
          ...request.query,
          ...request.headers
        })
        return response
          .response(httpResponse.body)
          .code(httpResponse.statusCode)
      }
    })
  }
  async start(port: number): Promise<void> {
    this.httpServer.settings.port = port
    await this.httpServer.start()
    console.log(`Server running at: ${this.httpServer.info.uri}`);
    
  }

}