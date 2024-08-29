export interface HelloWorldErrorPresenter {
  presentError(error: Error): any
}


export class ApiHelloWorldErrorPresenter implements HelloWorldErrorPresenter {
  presentError(error: Error): any {
    return error
  }
}