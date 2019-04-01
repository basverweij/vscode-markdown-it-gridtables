import AbstractGridTableCommand from "./AbstractGridTableCommand";
import nthIndexOf from "../common/NthIndexOf";
import { EditBuilder } from "./AbstractCommand";

export default abstract class AbstractCellCommand
    extends AbstractGridTableCommand
{
    protected cellLines: { start: number, end: number, text: string }[] = [];

    protected nextSeparatorLine: number = -1;

    protected internalExecute(): void
    {
        const line = this
            .position()
            .line;

        const activeCol = this.activeColumn(true);

        // find next separator line
        this.nextSeparatorLine = line + 1;
        for (; this.nextSeparatorLine < this.editor.document.lineCount; this.nextSeparatorLine++)
        {
            const text = this.editor.document.lineAt(this.nextSeparatorLine).text;

            if (text.startsWith("+"))
            {
                break;
            }

            if (!text.startsWith("|"))
            {
                // outside grid table
                return;
            }
        }

        // build cell lines
        for (let i = line; i <= this.nextSeparatorLine; i++)
        {
            const text = this.editor.document.lineAt(i).text;

            const columnChar = text.startsWith("|") ?
                "|" :
                "+";

            const start = nthIndexOf(text, columnChar, activeCol + 1) + 1;

            const end = nthIndexOf(text, columnChar, activeCol + 2);

            this.cellLines.push(
                {
                    start: start,
                    end: end,
                    text: text.substring(start, end),
                });
        }

        this.internalCellExecute();
    }

    protected abstract internalCellExecute(): void;

    protected ensureBlankCellLines(
        edit: EditBuilder,
        lines: number = 1
    )
    {
        const linesToInsert = this.shouldInsertCellLines(lines);

        if (linesToInsert > 0)
        {
            this.insertCellLines(
                edit,
                linesToInsert);
        }

        this.moveCellLines(
            edit,
            lines);
    }

    private shouldInsertCellLines(
        lines: number
    ): number
    {
        // check number of empty cell lines at the end of the cell, 
        // excluding the last cell line which is the separator to the next row
        for (let i = this.cellLines.length - 2; i > 0 && lines > 0; i-- && lines--)
        {
            if (this.cellLines[i].text.trim() !== "")
            {
                // cell line is not empty
                break;
            }
        }

        return lines;
    }

    private insertCellLines(
        edit: EditBuilder,
        lines: number
    ): void
    {
        // build empty cell line
        const tableLine = this.columnWidths
            .map(w => "|" + " ".repeat(w - 1))
            .join("") +
            "|" +
            this.eol();

        for (let i = 0; i < lines; i++)
        {
            // get cell line
            const cellLine = this.cellLines[this.cellLines.length - 2 - i];

            // insert new table line, including the previous cell line 
            edit.insert(
                this.nextSeparatorLine,
                0,
                tableLine.substring(0, cellLine.start) +
                cellLine.text +
                tableLine.substring(cellLine.end));
        }

        edit.perform();
    }

    private moveCellLines(
        edit: EditBuilder,
        lines: number // TODO actually support moving multiple lines
    ): void
    {
        const line = this.position().line;

        // move cell contents down
        for (let i = this.nextSeparatorLine - 1; i > line + 1; i--)
        {
            edit.replace(
                i,
                this.cellLines[i - line].start,
                this.cellLines[i - line].end,
                this.cellLines[i - line - 1].text);
        }

        // blank inserted line
        edit.replace(
            line + 1,
            this.cellLines[1].start,
            this.cellLines[1].end,
            " ".repeat(this.cellLines[1].text.length));

        edit.perform();
    }
}