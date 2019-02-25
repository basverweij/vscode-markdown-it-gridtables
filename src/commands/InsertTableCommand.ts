import * as vscode from "vscode";
import AbstractGridTableCommand from "./AbstractGridTableCommand";

export default class InsertTableCommand
    extends AbstractGridTableCommand
{
    protected internalExecute(): void
    {
        vscode.window.showWarningMessage("In a Grid Table");
    }

    protected internalNotInGridTable(): void
    {
        // build snippet string
        const snippet =
            "+---+---+\n" +
            "| $0${1: } | ${2: } |\n" +
            "+===+===+\n" +
            "| ${3: } | ${4: } |\n" +
            "+---+---+\n";

        // insert snippet
        const line = this.position().line;

        this.editor.insertSnippet(
            new vscode.SnippetString(snippet),
            new vscode.Position(line, 0));
    }
}