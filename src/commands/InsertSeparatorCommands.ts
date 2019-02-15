import * as vscode from "vscode";
import { DocumentAdapter } from "../common/DocumentAdapter";
import { getActiveTableColumnWidths } from "../gridtables/GetActiveTableColumnWidths";

export function insertSeparatorAboveCommand()
{
    insertSeparator(false);
}

export function insertSeparatorBelowCommand()
{
    insertSeparator(true);
}

function insertSeparator(
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

    // insert snippet
    const snippet =
        "+" +
        columnWidths
            .map((w) => "-".repeat(w - 1))
            .join("+") +
        "+\n$0";

    const line = activeEditor.selection.active.line + (insertBelow ? 1 : 0);

    activeEditor.insertSnippet(
        new vscode.SnippetString(snippet),
        new vscode.Position(line, 0));
}
