import * as vscode from "vscode";
import AbstractInsertCommand from "./AbstractInsertCommand";

export default class InsertSeparatorCommand
    extends AbstractInsertCommand
{
    internalExecute()
    {
        // insert snippet
        const snippet =
            "+" +
            this.columnWidths
                .map((w) => "-".repeat(w - 1))
                .join("+") +
            "+\n$0";

        const line = this.position().line +
            (this.insertBelow ? 1 : 0);

        this.editor.insertSnippet(
            new vscode.SnippetString(snippet),
            new vscode.Position(line, 0));
    }
}