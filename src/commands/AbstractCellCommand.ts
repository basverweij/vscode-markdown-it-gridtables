import AbstractGridTableCommand from "./AbstractGridTableCommand";
import nthIndexOf from "../common/NthIndexOf";
import { EditBuilder } from "./AbstractCommand";

export default abstract class AbstractCellCommand
    extends AbstractGridTableCommand
{
    protected cellLines: { start: number, end: number, text: string }[] = [];

    protected separatorLine: number = -1;

    protected internalExecute(): void
    {
        const line = this
            .position()
            .line;

        const activeCol = this.activeColumn(true);

        // find next separator line
        this.separatorLine = line + 1;
        for (; this.separatorLine < this.editor.document.lineCount; this.separatorLine++)
        {
            const text = this.editor.document.lineAt(this.separatorLine).text;

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
        for (let i = line; i <= this.separatorLine; i++)
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
        requiredLines: number = 1
    ): number
    {
        if (this.cellLines.length === 2)
        {
            // directly above the separator line
            // return requiredLines;
        }

        for (let i = this.cellLines.length - 2; i > 0 && requiredLines > 0; i-- && requiredLines--)
        {
            if (this.cellLines[i].text.trim() !== "")
            {
                // cell line is not empty
                break;
            }
        }

        return requiredLines;
    }

    private insertCellLines(
        edit: EditBuilder,
        lines: number = 1
    ): void
    {
        // for (let i = 0; lines > 0; i++)
        // {
        //     if (this.cellLines[this.cellLines.length - 2 - i].text.trim() !== "")
        //     {
        //         break;
        //     }

        //     lines--;
        // }

        for (let i = 0; i < lines; i++)
        {
            // get cell line
            const cellLine = this.cellLines[this.cellLines.length - 2 - i];

            // only insert a new line if we are on the line just before the separator
            // if (this.cellLines.length === 2)
            // {
            // build empty cell line
            const tableLine = this.columnWidths
                .map(w => "|" + " ".repeat(w - 1))
                .join("") +
                "|" +
                this.eol();

            edit.insert(
                this.separatorLine,
                0,
                tableLine.substring(0, cellLine.start) +
                cellLine.text + // include the last cell line when inserting
                tableLine.substring(cellLine.end));

            edit.perform();
            // }
        }
    }

    private moveCellLines(
        edit: EditBuilder,
        lines: number = 1
    ): void
    {
        const line = this.position().line;

        // move cell contents down
        for (let i = this.separatorLine - 1; i > line + 1; i--)
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