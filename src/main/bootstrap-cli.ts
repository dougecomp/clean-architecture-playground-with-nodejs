import { setupCommands } from "@/main/commands/commands";
import { CommanderCommandLineInterfaceFactory } from "@/main/factories/cli/commander-command-line-interface-factory";

async function main () {
  const cliFactory = new CommanderCommandLineInterfaceFactory()
  const cli = cliFactory.makeCli()

  setupCommands(cli)

  await cli.run()
}

main()