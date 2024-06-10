import { Server } from 'node:http'

import { Server as HapiServer, server } from '@hapi/hapi'

import { HttpController, HttpResponse } from "../../interface-adapters/controllers/http/http-controller";
import { HttpServer } from "./http-server";

export class HapiHttpServer implements HttpServer {
  private httpServer: HapiServer

  constructor () {
    this.httpServer = server({
      debug: {
        log: 'debug'
      }
    })
  }

  async registerController(method: string, route: string, controller: HttpController<any, any>): Promise<void> {
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

  registerCallback(method: string, route: string, callback: (body: any, params: any, query: any, headers: any) => Promise<HttpResponse>): void {
    this.httpServer.route({
      method: method as any,
      path: route.replace(/\:/g, ""),
      handler: async (request, response) => {
        const httpResponse = await callback(
          request.payload as any,
          request.params,
          request.query,
          request.headers
        )
        return response
          .response(httpResponse.body)
          .code(httpResponse.statusCode)
      }
    })
  }
  async start(port: number): Promise<Server> {
    this.httpServer.settings.port = port
    await this.httpServer.start()
    return this.httpServer.listener
  }

}