import * as vscode from "vscode";
import AbstractInsertCommand from "./AbstractInsertCommand";

export default class InsertLineCommand
    extends AbstractInsertCommand
{
    internalExecute()
    {
        // find active column
        const activeCol = this.activeColumn();

        // build snippet string
        const snippet =
            "$0" +
            this.columnWidths
                .map((w, i) => `| \$\{${((i - activeCol + this.columnWidths.length) % this.columnWidths.length) + 1}:${" ".repeat(w - 3)}\} `)
                .join("") +
            "|\n";

        // insert snippet
        const line = this.position().line +
            (this.insertBelow ? 1 : 0);

        this.editor.insertSnippet(
            new vscode.SnippetString(snippet),
            new vscode.Position(line, 0));
    }
}