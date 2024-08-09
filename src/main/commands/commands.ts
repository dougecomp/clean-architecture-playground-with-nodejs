import { CommandLineInterface } from "../../frameworks-and-drivers/command-line-interface/command-line-interface";
import { HelloWorldController } from "../../interface-adapters/controllers/hello-world-controller";

export function setupCommands (cli: CommandLineInterface) {
  cli.registerController({
    name: 'hello-world',
    controller: new HelloWorldController(),
    args: '<name>'
  })
}