import { Server } from 'node:http';

import express, { Express, Request, Response } from 'express';

import { HTTP_VERBS } from '../../interface-adapters/controllers/http/helpers';
import { HttpController } from "../../interface-adapters/controllers/http/http-controller";
import { HttpCallback, HttpServer, RegisterControllerInput } from "./http-server";

export class ExpressHttpServer implements HttpServer {
  private httpServer: Express

  constructor (
    
  ) {
    this.httpServer = express()
    this.httpServer.use(express.json())
  }
  
  registerController({ method, route, controller, preController }: RegisterControllerInput): void {
    this.httpServer[method](route.replace(/\{|\}/g, ""), async (req: Request, res: Response, next) => {
      if (preController) {
        const httpResponse = await preController.handle({
          ...req.body as any,
          ...req.params as any,
          ...req.query as any,
          ...req.headers as any
        })
        if (httpResponse.statusCode !== 200) {
          return res
          .status(httpResponse.statusCode)
          .send(httpResponse.body)
        }
        Object.assign(req.body, httpResponse.body)
        next()
      }
      next()
    }, async (req: Request, res: Response) => {
      const httpResponse = await controller.handle({
        ...req.body as any,
        ...req.params as any,
        ...req.query as any,
        ...req.headers as any
      })
      res
      .status(httpResponse.statusCode)
      .send(httpResponse.body)
    })
  }

  registerCallback(method: HTTP_VERBS, route: string, callback: HttpCallback): void {
    this.httpServer[method](route.replace(/\{|\}/g, ""), async (req: Request, res: Response) => {
      const response = await callback(req.body, req.params, req.query, req.headers)
      res
      .status(response.statusCode)
      .send(response.body)
    })
  }

  async start(port: number): Promise<Server> {
    return this.httpServer.listen(port)
  }
  
}