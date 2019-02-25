import * as vscode from 'vscode';
import AbstractInsertCommand from './AbstractInsertCommand';
import InsertLineCommand from "./InsertLineCommand";
import InsertSeparatorCommand from './InsertSeparatorCommand';
import AbstractGridTableCommand from './AbstractGridTableCommand';
import CellNewlineCommand from './CellNewlineCommand';
import InsertTableCommand from './InsertTableCommand';
import ToggleHeaderCommand from './ToggleHeaderCommand';
import SetColumnAlignmentCommand from './SetColumnAlignmentCommand';
import ColumnAlignments from '../common/ColumnAlignments';

enum CommandIds 
{
    InsertLineAbove = "markdownItGridTables.insertLineAbove",
    InsertLineBelow = "markdownItGridTables.insertLineBelow",
    InsertSeparatorAbove = "markdownItGridTables.insertSeparatorAbove",
    InsertSeparatorBelow = "markdownItGridTables.insertSeparatorBelow",
    InsertCellNewline = "markdownItGridTables.cellNewline",
    InsertTable = "markdownItGridTables.insertTable",
    ToggleHeader = "markdownItGridTables.toggleHeader",
    SetColumnAlignmentLeft = "markdownItGridTables.setColumnAlignmentLeft",
    SetColumnAlignmentCenter = "markdownItGridTables.setColumnAlignmentCenter",
    SetColumnAlignmentRight = "markdownItGridTables.setColumnAlignmentRight",
    SetColumnAlignmentNone = "markdownItGridTables.setColumnAlignmentNone",
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

        new CommandRegistration(
            CommandIds.ToggleHeader,
            buildCommand(ToggleHeaderCommand)),

        new CommandRegistration(
            CommandIds.SetColumnAlignmentLeft,
            buildSetColumnAlignmentCommand(SetColumnAlignmentCommand, ColumnAlignments.Left)),

        new CommandRegistration(
            CommandIds.SetColumnAlignmentCenter,
            buildSetColumnAlignmentCommand(SetColumnAlignmentCommand, ColumnAlignments.Center)),

        new CommandRegistration(
            CommandIds.SetColumnAlignmentRight,
            buildSetColumnAlignmentCommand(SetColumnAlignmentCommand, ColumnAlignments.Right)),

        new CommandRegistration(
            CommandIds.SetColumnAlignmentNone,
            buildSetColumnAlignmentCommand(SetColumnAlignmentCommand, ColumnAlignments.None)),
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

function buildSetColumnAlignmentCommand<T extends SetColumnAlignmentCommand>(
    TCommand: new (editor: vscode.TextEditor, alignment: ColumnAlignments) => T,
    alignment: ColumnAlignments
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
            alignment);

        cmd.execute();
    }
}
