import { CommanderCommandLineInterface } from "../frameworks-and-drivers/command-line-interface/commander-command-line-interface";
import { setupCommands } from "./commands/commands";

async function main () {
  const cli = new CommanderCommandLineInterface()

  setupCommands(cli)

  await cli.run()
}

main()