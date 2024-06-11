import { HttpServer } from "../../../frameworks-and-drivers/http-server/http-server";
import { HTTP_VERBS } from "./helpers";

export class XPTOController {
  constructor (httpServer: HttpServer) {
    httpServer.registerCallback({
      method: HTTP_VERBS.GET,
      route: '/xpto',
      callback: async (body: any, params: any, query: any, headers: any) => {
        return {
          statusCode: 200,
          body: {
            name: 'xpto'
          }
        }
      }
    })
  }
}