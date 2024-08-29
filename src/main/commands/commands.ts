import { CommandLineInterface } from "@/frameworks-and-drivers/command-line-interface/command-line-interface";
import { makeHelloWorldController } from "@/main/factories/controllers/hello-world-factory";

export function setupCommands (cli: CommandLineInterface) {
  cli.registerController({
    name: 'hello-world',
    controller: makeHelloWorldController(),
    args: '<name>'
  })
}