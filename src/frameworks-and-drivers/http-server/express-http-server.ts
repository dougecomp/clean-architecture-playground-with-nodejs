import { Server } from 'node:http';

import express, { Express, Request, Response } from 'express';

import { HttpServer, RegisterControllerInput } from "./http-server";
import { UnauthorizedError } from '../../interface-adapters/errors/unathorized-error';
import { ServerError } from '../../interface-adapters/errors/server-error';
import { HTTP_STATUS_CODE } from '../../interface-adapters/http/helpers';

export class ExpressHttpServer implements HttpServer {
  private httpServer: Express

  constructor (
    
  ) {
    this.httpServer = express()
    this.httpServer.use(express.json())
  }
  
  registerController({ method, route, controller }: RegisterControllerInput): void {
    this.httpServer[method](route.replace(/\{|\}/g, ""), async (req: Request, res: Response) => {
      const controllerResponse = await controller.handle({
        ...req.body as any,
        ...req.params as any,
        ...req.query as any,
        ...req.headers as any
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
    })
  }

  async start(port: number): Promise<Server> {
    return this.httpServer.listen(port)
  }
  
}