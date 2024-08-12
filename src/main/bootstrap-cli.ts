import { setupCommands } from "./commands/commands";
import { CommanderCommandLineInterfaceFactory } from "./factories/cli/commander-command-line-interface-factory";

async function main () {
  const cliFactory = new CommanderCommandLineInterfaceFactory()
  const cli = cliFactory.makeCli()

  setupCommands(cli)

  await cli.run()
}

main()