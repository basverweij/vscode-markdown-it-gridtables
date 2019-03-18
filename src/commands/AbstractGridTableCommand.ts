import getActiveTableColumnWidths from "../gridtables/GetActiveTableColumnWidths";
import AbstractCommand from "./AbstractCommand";

export default abstract class AbstractGridTableCommand
    extends AbstractCommand
{
    protected columnWidths: number[] = [];

    execute(): void
    {
        // get active table column widths
        this.columnWidths = getActiveTableColumnWidths(
            this.editor.document,
            this.editor.selection.active);

        if (this.columnWidths.length === 0)
        {
            this.warning("Grid Table start line not found, or no columns found.");

            return;
        }

        this.internalExecute();
    }

    protected abstract internalExecute(): void;

    protected activeColumn(
        normalized?: boolean
    ): number
    {
        const pos = this.position();

        const line = this.editor
            .document
            .lineAt(pos.line)
            .text;

        const splitChar =
            line.startsWith("+") ?
                "+" :
                "|";

        let activeCol = line
            .substr(0, pos.character)
            .split(splitChar)
            .length - 2;

        if (normalized)
        {
            if (activeCol < 0)
            {
                activeCol = 0;
            }
            else if (activeCol >= this.columnWidths.length)
            {
                activeCol = this.columnWidths.length - 1;
            }
        }

        return activeCol;
    }
}