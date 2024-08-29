export type HelloWorldPresenterInput = {name: string}

export interface HelloWorldPresenter {
  present(input: HelloWorldPresenterInput): any
}

export class ApiHelloWorldPresenter implements HelloWorldPresenter {
  present(input: HelloWorldPresenterInput): any {
    return {
      message: `Hello World ${input.name}!`
    }
  }
}