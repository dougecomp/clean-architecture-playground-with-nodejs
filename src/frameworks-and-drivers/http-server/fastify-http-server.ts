import { Server } from 'node:http'

import cors from '@fastify/cors'
import Fastify, { FastifyInstance } from "fastify"

import { HttpServer, RegisterControllerInput } from "./http-server"
import { ServerError } from '../../interface-adapters/errors/server-error'
import { UnauthorizedError } from '../../interface-adapters/errors/unathorized-error'
import { HTTP_STATUS_CODE } from '../../interface-adapters/http/helpers'

export class FastifyHttpServer implements HttpServer {
  private httpServer: FastifyInstance

  constructor () {
    this.httpServer = Fastify({
      logger: true
    })

    this.setupMiddlewares()
  }

  private setupMiddlewares () {
    this.httpServer.register(cors)
  }

  registerController({ method, route, controller }: RegisterControllerInput): void {
    this.httpServer.route({
      method: method,
      url: route.replace(/\{|\}/g, ""),
      handler: async (req, res) => {
        const controllerResponse = await controller.handle({
          ...req.body || {},
          ...req.query || {},
          ...req.params || {},
          ...req.headers || {}
        })
        const error = controllerResponse.error
        if (error instanceof ServerError) {
          return res
          .status(HTTP_STATUS_CODE.SERVER_ERROR)
          .send(error)
        }
        if (error instanceof UnauthorizedError) {
          return res
          .status(HTTP_STATUS_CODE.UNAUTHORIZED)
          .send(error)        
        }
        if (error instanceof Error) {
          return res
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .send(error)
        }
        if (method === 'post') {
          return res
          .status(HTTP_STATUS_CODE.CREATED)
          .send(controllerResponse.data)
        }
        return res
        .status(HTTP_STATUS_CODE.OK)
        .send(controllerResponse.data)
      }
    })
  }
  
  async start (port: number): Promise<Server> {
    await this.httpServer.listen({
      port
    })
    return this.httpServer.server
  }
}