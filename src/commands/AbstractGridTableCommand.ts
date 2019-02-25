import * as vscode from "vscode";
import getActiveTableColumnWidths from "../gridtables/GetActiveTableColumnWidths";

export default abstract class AbstractGridTableCommand
{
    protected columnWidths: number[] = [];

    constructor(
        protected readonly editor: vscode.TextEditor)
    { }

    execute()
    {
        // get active table column widths
        this.columnWidths = getActiveTableColumnWidths(
            this.editor.document,
            this.editor.selection.active);

        if (this.columnWidths.length === 0)
        {
            this.internalNotInGridTable();

            return;
        }

        this.internalExecute();
    }

    protected abstract internalExecute(): void;

    protected internalNotInGridTable(): void
    {
        this.warning("Not in a Grid Table");
    }

    protected warning(
        message: string
    )
    {
        vscode.window.showWarningMessage(message);
    }

    protected position(): vscode.Position
    {
        return this.editor
            .selection
            .active;
    }

    protected activeColumn(): number
    {
        const pos = this.position();

        const line = this.editor
            .document
            .lineAt(pos.line)
            .text;

        return line
            .substr(0, pos.character)
            .split("|")
            .length - 2;
    }
}