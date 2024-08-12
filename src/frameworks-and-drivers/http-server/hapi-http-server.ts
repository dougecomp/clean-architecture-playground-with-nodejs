import { Server } from 'node:http';

import { Server as HapiServer, server } from '@hapi/hapi';
import { badRequest, unauthorized } from '@hapi/boom';

import { HTTP_STATUS_CODE } from '../../interface-adapters/http/helpers';
import { extractHttpResponse } from './helpers';
import { HttpServer, RegisterControllerInput } from "./http-server";

export class HapiHttpServer implements HttpServer {
  private httpServer: HapiServer

  constructor () {
    this.httpServer = server()
  }

  registerController({ method, route, controller }: RegisterControllerInput): void {
    this.httpServer.route({
      method: method,
      path: route.replace(/:/g, ""),
      handler: async (request, response) => {
        const controllerResponse = await controller.handle({
          ...request.payload as object || {},
          ...request.params || {},
          ...request.query || {},
          ...request.headers || {}
        })
        const {body, statusCode} = extractHttpResponse({
          data: controllerResponse.data,
          error: controllerResponse.error,
          method
        })
        if (statusCode === HTTP_STATUS_CODE.UNAUTHORIZED) {
          throw unauthorized(body)
        }
        if (statusCode === HTTP_STATUS_CODE.BAD_REQUEST) {
          throw badRequest(body)
        }
        return response
          .response(body)
          .code(statusCode)
      }
    })
  }

  async start(port: number): Promise<Server> {
    this.httpServer.settings.port = port
    await this.httpServer.start()
    return this.httpServer.listener
  }

}