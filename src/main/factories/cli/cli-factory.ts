import { CommandLineInterface } from "../../../frameworks-and-drivers/command-line-interface/command-line-interface";

export interface CLIFactory {
  makeCli(): CommandLineInterface
}