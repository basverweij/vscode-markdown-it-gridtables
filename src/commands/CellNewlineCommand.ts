import AbstractGridTableCommand from "./AbstractGridTableCommand";
import nthIndexOf from "../common/NthIndexOf";

export default class CellNewlineCommand
    extends AbstractGridTableCommand
{
    protected internalExecute(): void
    {
        const line = this
            .position()
            .line;

        if (this.atStartOfTable(line))
        {
            // only insert newline
            this.newEdit()
                .insert(line, 0, this.eol())
                .complete();

            return;
        }

        const activeCol = this.activeColumn(true);

        const edit = this.newEdit();

        const cellLines: { start: number, end: number, text: string }[] = [];

        if (this.shouldInsertCellLine(line, activeCol))
        {
            // build empty cell line
            const cellLine = this.columnWidths
                .map(w => "|" + " ".repeat(w - 1))
                .join("") +
                "|" +
                this.eol();

            // find next separator
            let i = line + 1;
            for (; i < this.editor.document.lineCount; i++)
            {
                if (this.editor.document.lineAt(i).text.startsWith("+"))
                {
                    break;
                }
            }

            // get cell lines
            for (let j = line; j <= i; j++)
            {
                const text = this.editor.document.lineAt(j).text;

                const columnChar = text.startsWith("|") ?
                    "|" :
                    "+";

                const start = nthIndexOf(text, columnChar, activeCol + 1) + 1;

                const end = nthIndexOf(text, columnChar, activeCol + 2);

                cellLines.push(
                    {
                        start: start,
                        end: end,
                        text: text.substring(start, end),
                    });
            }

            // insert before separator
            const lastCellLine = cellLines[cellLines.length - 2];

            edit.insert(
                i,
                0,
                cellLine.substring(0, lastCellLine.start) +
                lastCellLine.text +
                cellLine.substring(lastCellLine.end));

            edit.perform();

            // move cell contents down
            for (--i; i > line + 1; i--)
            {
                edit.replace(
                    i,
                    cellLines[i - line].start,
                    cellLines[i - line].end,
                    cellLines[i - line - 1].text);
            }

            // blank inserted line
            edit.replace(
                line + 1,
                cellLines[1].start,
                cellLines[1].end,
                " ".repeat(cellLines[1].end - cellLines[1].start));

            edit.perform();
        }

        // check if we need to replace part of the current cell line
        const text = this
            .editor
            .document
            .lineAt(line)
            .text;

        // only break cell lines
        if (text.startsWith("|"))
        {
            const start = this.position().character;

            const end = nthIndexOf(text, "|", activeCol + 2);

            let remainingCellLine = text
                .substring(start, end)
                .trimRight();

            if (remainingCellLine !== "")
            {
                const cellStart = nthIndexOf(text, "|", activeCol + 1) + 2;

                // replace remaining cell line with spaces
                edit.replace(line, start, start + remainingCellLine.length, " ".repeat(remainingCellLine.length));

                // move remaining cell line to start of next cell line
                remainingCellLine = remainingCellLine.trim();
                edit.replace(line + 1, cellStart, cellStart + remainingCellLine.length, remainingCellLine);

                // complete edit and update selection
                edit
                    .complete()
                    .then(() =>
                    {
                        // select start of next cell line
                        this.select(
                            line + 1,
                            cellStart);
                    });

                return;
            }
        }

        if (cellLines.length > 0)
        {
            // blank the inserted line
            edit.replace(
                line + 1,
                cellLines[0].start,
                cellLines[0].end,
                " ".repeat(cellLines[0].end - cellLines[0].start));
        }

        edit
            .complete()
            // select blank cell line
            .then(() =>
            {
                // get column start character
                const text = this.editor
                    .document
                    .lineAt(line + 1)
                    .text;

                const columnChar = text.indexOf("+") >= 0 ?
                    "+" :
                    "|";

                let fromCharacter = nthIndexOf(
                    text,
                    columnChar,
                    activeCol + 1)
                    + 2;

                let toCharacter = nthIndexOf(
                    text,
                    columnChar,
                    activeCol + 2)
                    - 1;

                this.select(
                    line + 1,
                    fromCharacter,
                    toCharacter - fromCharacter);
            });
    }

    private shouldInsertCellLine(
        line: number,
        activeCol: number
    ): boolean
    {
        if (line === this.editor.document.lineCount - 1)
        {
            // last line
            return true;
        }

        const nextLine = this.editor
            .document
            .lineAt(line + 1)
            .text;

        if (!nextLine.startsWith("|"))
        {
            // next line is not a cell line
            return true;
        }

        const nextColumn = nextLine
            .substring(
                nthIndexOf(nextLine, "|", activeCol + 1) + 1,
                nthIndexOf(nextLine, "|", activeCol + 2) - 1,
            )
            .trim();

        // next line is not empty
        return nextColumn !== "";
    }

    private atStartOfTable(
        line: number
    ): boolean
    {
        if (this.position().character > 0)
        {
            // not a the beginning of a line
            return false;
        }

        if (!this.editor.document.lineAt(line).text.startsWith("+"))
        {
            // not a separator line
            return false;
        }

        return (line === 0) || // first line in the document
            !this.editor.document.lineAt(line - 1).text.startsWith("|"); // not a table line
    }
}