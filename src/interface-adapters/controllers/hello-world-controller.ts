import { HelloWorldErrorPresenter } from "../presenters/hello-world-error-presenter"
import { HelloWorldPresenter } from "../presenters/hello-world-presenter"
import { Controller, ControllerOutput } from "./controller"

export interface HelloWorldControllerInput {
  name: string
}

export class HelloWorldController implements Controller<HelloWorldControllerInput> {
  constructor (
    private readonly presenter: HelloWorldPresenter,
    private readonly errorPresenter: HelloWorldErrorPresenter
  ) {}

  async handle(input: HelloWorldControllerInput): Promise<ControllerOutput> {
    if (input.name === 'error') {
      return {
        error: this.errorPresenter.presentError(new Error('name is required'))
      }
    }
    return {
      data: this.presenter.present(input)
    }
  }
}
