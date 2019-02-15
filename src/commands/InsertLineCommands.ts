import * as vscode from "vscode";
import { DocumentAdapter } from "../common/DocumentAdapter";
import { getActiveTableColumnWidths } from "../gridtables/GetActiveTableColumnWidths";

export function insertLineAboveCommand()
{
    insertLine(false);
}

export function insertLineBelowCommand()
{
    insertLine(true);
}

function insertLine(
    insertBelow: boolean = false)
{
    const activeEditor = vscode.window.activeTextEditor;

    if (!activeEditor)
    {
        return;
    }

    var doc = new DocumentAdapter(activeEditor);

    // get active table column widths
    const columnWidths = getActiveTableColumnWidths(doc);

    if (columnWidths.length === 0)
    {
        // TODO show notification
        return;
    }

    // find active column
    const pos = activeEditor.selection.active;

    for (var activeCol = 0, c = 0; activeCol < columnWidths.length; activeCol++)
    {
        c += columnWidths[activeCol];
        if (c > pos.character)
        {
            break;
        }
    }

    // build snippet string
    const snippet =
        "$0" +
        columnWidths
            .map((w, i) => `| \$\{${((i - activeCol + columnWidths.length) % columnWidths.length) + 1}:${" ".repeat(w - 3)}\} `)
            .join("") +
        "|\n";

    // insert snippet
    const line = pos.line + (insertBelow ? 1 : 0);

    activeEditor.insertSnippet(
        new vscode.SnippetString(snippet),
        new vscode.Position(line, 0));
}