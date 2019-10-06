import AbstractGridTableCommand from "./AbstractGridTableCommand";
import nthIndexOf from "../common/NthIndexOf";
import { EditBuilder } from "./AbstractCommand";

export default abstract class AbstractCellCommand
    extends AbstractGridTableCommand
{
    protected cellLines: { start: number, end: number, text: string, columnChar: string }[] = [];

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
        for (let i = line; i <= this.nextSeparatorLine && i < this.editor.document.lineCount; i++)
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
                    columnChar: columnChar,
                });
        }

        this.internalCellExecute();
    }

    protected abstract internalCellExecute(): void;

    protected insertLines(
        edit: EditBuilder,
        lines: string[]
    ): void
    {
        if (lines.length === 0)
        {
            // nothing to do
            return;
        }

        // ensure enough empty cell lines to insert the provided lines
        const linesToInsert = this.shouldInsertCellLines(lines.length - 1);

        if (linesToInsert > 0)
        {
            this.insertCellLines(
                edit,
                linesToInsert);
        }

        // special case: insert empty line when current line is
        // at a separator line -> ignore this empty line
        if (lines[0] === "" &&
            this.cellLines[0].columnChar === "+")
        {
            lines = lines.slice(1);
        }
        else
        {
            // add current cell line breaks to provided lines
            const breaks = this.getFirstCellLineBreaks();

            if (breaks.length >= 1)
            {
                // add leading break to first line
                lines[0] = breaks[0] + lines[0];
            }

            if (breaks.length === 2)
            {
                // add leading break to last line
                lines[lines.length - 1] = lines[lines.length - 1] + breaks[1];
            }
        }

        // replace cell lines
        const end =
            this.cellLines.length - 1 - // ignore separator line
            (lines.length - 1) + // exclude available blank lines
            linesToInsert; // include added blank lines

        const cellLines =
            this.cellLines.length > 2 ?
            this.cellLines
                .slice(1, end)
                .map(c => c.text) :
            [];

        const newCellLines = [...lines, ...cellLines];

        this.updateCellLines(
            edit,
            0,
            newCellLines);
    }

    protected ensureBlankCellLines(
        edit: EditBuilder,
        lines: number = 1
    ): void
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

    private getFirstCellLineBreaks(): string[]
    {
        const firstLine = this.cellLines[0];

        if (firstLine.columnChar === "+")
        {
            // only break cell lines
            return [];
        }

        let cellPos = this.position().character - firstLine.start;

        if (cellPos < 0)
        {
            cellPos = 0;
        }

        const leadingCellLine = firstLine
            .text
            .substring(0, cellPos)
            .trimRight();

        const remainingCellLine = firstLine
            .text
            .substring(cellPos)
            .trimRight();

        if (remainingCellLine === "")
        {
            // no break needed, only return the (right-trimmed) part up to the current character
            return [leadingCellLine];
        }

        return [leadingCellLine, remainingCellLine];
    }

    private updateCellLines(
        edit: EditBuilder,
        fromLine: number,
        newCellLines: string[]
    ): void
    {
        const line = this.position().line;

        for (let i = 0; i < newCellLines.length; i++)
        {
            let text = newCellLines[i];

            if (text.length > 0 &&
                text.charAt(0) !== " ")
            {
                // add leading space
                text = " " + text;
            }

            const width = this.cellLines[fromLine + i].end - this.cellLines[fromLine + i].start;

            if (text.length < width)
            {
                // add trailing space
                text = text + " ".repeat(width - text.length);
            }

            edit.replace(
                line + fromLine + i,
                this.cellLines[fromLine + i].start,
                this.cellLines[fromLine + i].end,
                text);
        }

        edit.perform();
    }
}