import { Server } from 'node:http'

import Fastify, { FastifyInstance } from "fastify"
import cors from '@fastify/cors'

import { HttpServer, RegisterControllerV2 } from "./http-server"
import { HttpController } from "../../interface-adapters/controllers/http/http-controller"
import { HTTP_VERBS, HttpResponse } from '../../interface-adapters/controllers/http/helpers'

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

  registerController (method: HTTP_VERBS, route: string, httpController: HttpController): void {
    this.httpServer.route({
      method: method,
      url: route.replace(/\{|\}/g, ""),
      handler: async (req, res) => {
        const httpResponse = await httpController.handle({
          ...req.body || {},
          ...req.query || {},
          ...req.params || {},
          ...req.headers || {}
        })

        res
        .status(httpResponse.statusCode)
        .send(httpResponse.body)
      }
    })
  }

  registerControllerV2({ method, route, controller, preController }: RegisterControllerV2): void {
    this.httpServer.route({
      method: method,
      url: route.replace(/\{|\}/g, ""),
      preHandler: async (req, res) => {
        if (preController) {
          const httpResponse = await preController.handle({
            ...req.body || {},
            ...req.query || {},
            ...req.params || {},
            ...req.headers || {}
          })
          if (httpResponse.statusCode !== 200) {
            return res
            .status(httpResponse.statusCode)
            .send(httpResponse.body)
          }
          req.body = {
            ...req.body || {},
            ...httpResponse.body
          }
        }
      },
      handler: async (req, res) => {
        const httpResponse = await controller.handle({
          ...req.body || {},
          ...req.query || {},
          ...req.params || {},
          ...req.headers || {}
        })
        res
        .status(httpResponse.statusCode)
        .send(httpResponse.body)
      }
    })
  }

  registerCallback(method: HTTP_VERBS, route: string, callback: (body: any, params: any, query: any, headers: any) => Promise<HttpResponse<any>>): void {
    this.httpServer.route({
      method: method,
      url: route.replace(/\{|\}/g, ""),
      handler: async (req, res) => {
        const response = await callback(req.body || {}, req.params || {}, req.query || {}, req.headers)
        res
        .status(response.statusCode)
        .send(response.body)
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