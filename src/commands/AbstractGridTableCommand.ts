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
            vscode.window.showWarningMessage("No active Grid Table found");
            return;
        }

        this.internalExecute();
    }

    protected abstract internalExecute(): void;

    protected position(): vscode.Position
    {
        return this.editor
            .selection
            .active;
    }

    protected activeColumn(): number
    {
        const pos = this.position();

        for (var i = 0, c = 0; i < this.columnWidths.length; i++)
        {
            c += this.columnWidths[i];

            if (c > pos.character)
            {
                break;
            }
        }

        return i;
    }
}