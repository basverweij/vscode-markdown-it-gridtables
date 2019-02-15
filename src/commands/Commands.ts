import { insertLineAboveCommand, insertLineBelowCommand } from "./InsertLineCommands";
import { insertSeparatorAboveCommand, insertSeparatorBelowCommand } from "./InsertSeparatorCommands";

enum Commands 
{
    InsertLineAbove = "markdownItGridTables.insertLineAbove",
    InsertLineBelow = "markdownItGridTables.insertLineBelow",
    InsertSeparatorAbove = "markdownItGridTables.insertSeparatorAbove",
    InsertSeparatorBelow = "markdownItGridTables.insertSeparatorBelow",
}

class CommandRegistration
{
    constructor(
        public command: string,
        public callback: (...args: any[]) => any)
    { }
}

const CommandRegistrations: CommandRegistration[] =
    [
        new CommandRegistration(Commands.InsertLineAbove, insertLineAboveCommand),
        new CommandRegistration(Commands.InsertLineBelow, insertLineBelowCommand),
        new CommandRegistration(Commands.InsertSeparatorAbove, insertSeparatorAboveCommand),
        new CommandRegistration(Commands.InsertSeparatorBelow, insertSeparatorBelowCommand),
    ];

export default CommandRegistrations;
