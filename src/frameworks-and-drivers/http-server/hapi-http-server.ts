import { Server } from 'node:http';

import Boom from '@hapi/boom';
import { Server as HapiServer, server } from '@hapi/hapi';

import { HttpServer, RegisterControllerInput } from "./http-server";
import { ServerError } from '../../interface-adapters/errors/server-error';
import { UnauthorizedError } from '../../interface-adapters/errors/unathorized-error';
import { HTTP_STATUS_CODE } from '../../interface-adapters/http/helpers';

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
        const controllerResponse = await controller.handle({
          ...request.payload as object || {},
          ...request.params || {},
          ...request.query || {},
          ...request.headers || {},
          ...request.pre[assign]
        })

        if (controllerResponse.error instanceof ServerError) {
          return response
          .response(controllerResponse.error)
          .code(HTTP_STATUS_CODE.SERVER_ERROR)
        }
        if (controllerResponse.error instanceof UnauthorizedError) {
          return response
          .response(controllerResponse.error)
          .code(HTTP_STATUS_CODE.UNAUTHORIZED)
        }
        if (controllerResponse.error instanceof Error) {
          return response
          .response(controllerResponse.error)
          .code(HTTP_STATUS_CODE.BAD_REQUEST)
        }
        return response
          .response(controllerResponse.data)
          .code(HTTP_STATUS_CODE.OK)
      }
    })
    this.httpServer.ext('onPreResponse', (request, response) => {
      if (request.response && request.response instanceof Boom.Boom && request.response.isBoom) {
        return response.response(request.response.output.payload).code(request.response.output.statusCode);
      }
      return response.continue;
    })
  }

  async start(port: number): Promise<Server> {
    this.httpServer.settings.port = port
    await this.httpServer.start()
    return this.httpServer.listener
  }

}