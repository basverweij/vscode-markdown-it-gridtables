import * as vscode from 'vscode';
import AbstractInsertCommand from './AbstractInsertCommand';
import InsertLineCommand from "./InsertLineCommand";
import InsertSeparatorCommand from './InsertSeparatorCommand';
import AbstractGridTableCommand from './AbstractGridTableCommand';
import CellNewlineCommand from './CellNewlineCommand';
import InsertTableCommand from './InsertTableCommand';

enum CommandIds 
{
    InsertLineAbove = "markdownItGridTables.insertLineAbove",
    InsertLineBelow = "markdownItGridTables.insertLineBelow",
    InsertSeparatorAbove = "markdownItGridTables.insertSeparatorAbove",
    InsertSeparatorBelow = "markdownItGridTables.insertSeparatorBelow",
    InsertCellNewline = "markdownItGridTables.cellNewline",
    InsertTable = "markdownItGridTables.insertTable",
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

        new CommandRegistration(
            CommandIds.InsertCellNewline,
            buildCommand(CellNewlineCommand)),

        new CommandRegistration(
            CommandIds.InsertTable,
            buildCommand(InsertTableCommand)),
    ];

export default Commands;

function buildCommand<T extends AbstractGridTableCommand>(
    TCommand: new (editor: vscode.TextEditor) => T
): TCallback
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
        const cmd = new TCommand(editor);

        cmd.execute();
    }
}

function buildInsertCommand<T extends AbstractInsertCommand>(
    TCommand: new (editor: vscode.TextEditor, insertBelow: boolean) => T,
    insertBelow: boolean
): TCallback
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
