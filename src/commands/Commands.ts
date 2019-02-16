import * as vscode from 'vscode';
import AbstractInsertCommand from './AbstractInsertCommand';
import InsertLineCommand from "./InsertLineCommand";
import InsertSeparatorCommand from './InsertSeparatorCommand';

enum CommandIds 
{
    InsertLineAbove = "markdownItGridTables.insertLineAbove",
    InsertLineBelow = "markdownItGridTables.insertLineBelow",
    InsertSeparatorAbove = "markdownItGridTables.insertSeparatorAbove",
    InsertSeparatorBelow = "markdownItGridTables.insertSeparatorBelow",
}

type TCallback = (...args: any[]) => any;

class CommandRegistration
{
    constructor(
        public command: string,
        public callback: TCallback)
    { }
}

const Commands: CommandRegistration[] =
    [
        new CommandRegistration(
            CommandIds.InsertLineAbove,
            buildInsertCommand(InsertLineCommand, false)
        ),

        new CommandRegistration(
            CommandIds.InsertLineBelow,
            buildInsertCommand(InsertLineCommand, true)),

        new CommandRegistration(
            CommandIds.InsertSeparatorAbove,
            buildInsertCommand(InsertSeparatorCommand, false)),

        new CommandRegistration(
            CommandIds.InsertSeparatorBelow,
            buildInsertCommand(InsertSeparatorCommand, true)),
    ];

export default Commands;

function buildInsertCommand<T extends AbstractInsertCommand>(
    TCommand: new (editor: vscode.TextEditor, insertBelow: boolean) => T,
    insertBelow: boolean):
    TCallback
{
    return () =>
    {
        // get active text editor
        const editor = vscode
            .window
            .activeTextEditor;

        if (!editor)
        {
            return;
        }

        // execute command
        const cmd = new TCommand(
            editor,
            insertBelow);

        cmd.execute();
    }
}
