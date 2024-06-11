import { Server } from 'node:http'

import { Server as HapiServer, server } from '@hapi/hapi'
import Boom from '@hapi/boom'

import { HttpController } from "../../interface-adapters/controllers/http/http-controller";
import { HttpServer, RegisterControllerV2 } from "./http-server";
import { HTTP_VERBS, HttpResponse } from '../../interface-adapters/controllers/http/helpers';

export class HapiHttpServer implements HttpServer {
  private httpServer: HapiServer

  constructor () {
    this.httpServer = server({
      debug: {
        log: 'debug'
      }
    })
  }

  registerController({ method, route, controller, preController }: RegisterControllerV2): void {
    const assign = `preController_${method}_${route}`
    this.httpServer.route({
      method: method,
      path: route.replace(/\:/g, ""),
      options: {
        pre: [
          {
            method: async (req, res) => {
              if (!preController) return res.continue              
              const httpResponse = await preController.handle({
                ...req.payload as any || {},
                ...req.query || {},
                ...req.params || {},
                ...req.headers || {}
              })
              let error: Boom.Boom | null = null
              if (httpResponse.statusCode >= 500) {
                error = Boom.badImplementation<Boom.Boom>(httpResponse.body)
                error.output.statusCode = httpResponse.statusCode
              }
              if (httpResponse.statusCode >= 400) {
                error = Boom.badRequest<Boom.Boom>(httpResponse.body)
                error.output.statusCode = httpResponse.statusCode
              }
              if (error) {
                throw error
              }
              return httpResponse.body
            
            },
            assign
          }
        ]
      },
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


  registerCallback(method: string, route: string, callback: (body: any, params: any, query: any, headers: any) => Promise<HttpResponse>): void {
    this.httpServer.route({
      method: method as any,
      path: route.replace(/\:/g, ""),
      handler: async (request, response) => {
        const httpResponse = await callback(
          request.payload || {},
          request.params  || {},
          request.query  || {},
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