import { insertLineAboveCommand, insertLineBelowCommand } from "./InsertLineCommands";
import { insertSeparatorAboveCommand, insertSeparatorBelowCommand } from "./InsertSeparatorCommands";

enum CommandIds 
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

const Commands: CommandRegistration[] =
    [
        new CommandRegistration(CommandIds.InsertLineAbove, insertLineAboveCommand),
        new CommandRegistration(CommandIds.InsertLineBelow, insertLineBelowCommand),
        new CommandRegistration(CommandIds.InsertSeparatorAbove, insertSeparatorAboveCommand),
        new CommandRegistration(CommandIds.InsertSeparatorBelow, insertSeparatorBelowCommand),
    ];

export default Commands;
