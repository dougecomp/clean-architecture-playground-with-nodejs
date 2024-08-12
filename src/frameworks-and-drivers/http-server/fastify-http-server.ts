import { Server } from 'node:http'

import cors from '@fastify/cors'
import Fastify, { FastifyInstance } from "fastify"

import { extractHttpResponse } from './helpers'
import { HttpServer, RegisterControllerInput } from "./http-server"

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
        const {body, statusCode} = extractHttpResponse({
          data: controllerResponse.data,
          error: controllerResponse.error,
          method
        })
        return res
        .status(statusCode)
        .send(body)
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