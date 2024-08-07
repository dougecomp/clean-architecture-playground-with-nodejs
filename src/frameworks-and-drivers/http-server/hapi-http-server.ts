import { Server } from 'node:http';

import { Server as HapiServer, server } from '@hapi/hapi';

import { HttpServer, RegisterControllerInput } from "./http-server";
import { ServerError } from '../../interface-adapters/errors/server-error';
import { UnauthorizedError } from '../../interface-adapters/errors/unathorized-error';
import { HTTP_STATUS_CODE } from '../../interface-adapters/http/helpers';
import { badRequest, unauthorized } from '@hapi/boom';

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

        if (controllerResponse.error instanceof ServerError) {
          return response
          .response(controllerResponse.error)
          .code(HTTP_STATUS_CODE.SERVER_ERROR)
        }
        if (controllerResponse.error instanceof UnauthorizedError) {
          throw unauthorized(controllerResponse.error)
        }
        if (controllerResponse.error instanceof Error) {
          throw badRequest(controllerResponse.error)
        }
        return response
          .response(controllerResponse.data)
          .code(HTTP_STATUS_CODE.OK)
      }
    })
  }

  async start(port: number): Promise<Server> {
    this.httpServer.settings.port = port
    await this.httpServer.start()
    return this.httpServer.listener
  }

}