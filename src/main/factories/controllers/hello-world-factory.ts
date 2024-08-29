import { HelloWorldController } from "@/interface-adapters/controllers/hello-world-controller";
import { ApiHelloWorldErrorPresenter } from "@/interface-adapters/presenters/hello-world-error-presenter";
import { ApiHelloWorldPresenter } from "@/interface-adapters/presenters/hello-world-presenter";

export function makeHelloWorldController () {
  return new HelloWorldController(
    new ApiHelloWorldPresenter(),
    new ApiHelloWorldErrorPresenter()
  )
}