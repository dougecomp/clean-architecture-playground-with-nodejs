import { HttpServer } from "../../../frameworks-and-drivers/http-server/http-server";
import { HTTP_VERBS } from "./helpers";

export class XPTOController {
  constructor (httpServer: HttpServer) {
    httpServer.registerCallback(HTTP_VERBS.GET, '/xpto', async (body: any, params: any, query: any, headers: any) => {
      return {
        statusCode: 200,
        body: {
          name: 'xpto'
        }
      }
    })
  }
}