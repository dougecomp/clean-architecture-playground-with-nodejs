import { CommandLineInterface } from "../../../frameworks-and-drivers/command-line-interface/command-line-interface";
import { CommanderCommandLineInterface } from "../../../frameworks-and-drivers/command-line-interface/commander-command-line-interface";

export class CommanderCommandLineInterfaceFactory {
  makeCli (): CommandLineInterface {
    return new CommanderCommandLineInterface()
  }
}