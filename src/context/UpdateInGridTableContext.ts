import * as vscode from "vscode";

namespace UpdateInGridTableContext
{
    /**
     * Saves the current 'in grid table' state for each document.
     */
    export var State: { [key: string]: boolean } = {};
}

export default function updateInGridTableContext(
    editor: vscode.TextEditor
)
{
    // get current document uri
    const uri = editor
        .document
        .uri
        .toString();

    // get current position
    const pos = editor
        .selection
        .anchor;

    // get current line
    const line = editor
        .document
        .lineAt(pos.line)
        .text;

    // determine if we are in a grid table
    const inGridTable =
        line.startsWith("+") ||
        line.startsWith("|");

    if (UpdateInGridTableContext.State[uri] === inGridTable)
    {
        // no change 
        return;
    }

    // save new value
    UpdateInGridTableContext.State[uri] = inGridTable;

    // update context
    vscode.commands.executeCommand(
        "setContext",
        "markdownItGridTables:inGridTable",
        inGridTable);
}