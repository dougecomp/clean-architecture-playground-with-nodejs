import { Server } from 'node:http';

import Boom from '@hapi/boom';
import { Server as HapiServer, server } from '@hapi/hapi';

import { HttpServer, RegisterCallbackInput, RegisterControllerInput } from "./http-server";

export class HapiHttpServer implements HttpServer {
  private httpServer: HapiServer

  constructor () {
    this.httpServer = server({
      debug: {
        log: 'debug'
      }
    })
    this.httpServer.ext('onPreResponse', (request, response) => {
      if (request.response && request.response instanceof Boom.Boom && request.response.isBoom) {
        return response.response(request.response.output.payload).code(request.response.output.statusCode);
      }
      return response.continue;
    })
  }

  registerController({ method, route, controller }: RegisterControllerInput): void {
    const assign = `preController_${method}_${route}`
    this.httpServer.route({
      method: method,
      path: route.replace(/:/g, ""),
      handler: async (request, response) => {
        const httpResponse = await controller.handle({
          ...request.payload as object || {},
          ...request.params || {},
          ...request.query || {},
          ...request.headers || {},
          ...request.pre[assign]
        })
        
        return response
          .response(httpResponse.body)
          .code(httpResponse.statusCode)
      }
    })
    this.httpServer.ext('onPreResponse', (request, response) => {
      if (request.response && request.response instanceof Boom.Boom && request.response.isBoom) {
        return response.response(request.response.output.payload).code(request.response.output.statusCode);
      }
      return response.continue;
    })
  }

  registerCallback({ method, route, callback }: RegisterCallbackInput): void {
    const assign = `preCallback_${method}_${route}`
    this.httpServer.route({
      method: method as any,
      path: route.replace(/:/g, ""),
      handler: async (request, response) => {
        const body = {
          ...request.payload as any || {},
          ...request.pre[assign]
        }
        const httpResponse = await callback(
          body,
          request.params  || {},
          request.query  || {},
          request.headers,
          
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