import AbstractGridTableCommand from "./AbstractGridTableCommand";
import nthIndexOf from "../common/NthIndexOf";
import { Insert, Replacement } from "./AbstractCommand";

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
            this.makeInserts(
                new Insert(line, 0, this.eol()));

            return;
        }

        let activeCol = this.activeColumn(true);

        let promise: PromiseLike<boolean>;

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

            promise = this
                // insert before separator
                .makeInserts(
                    new Insert(i, 0, cellLine))
                // move cell contents down
                .then(() =>
                {
                    const replacements: Replacement[] = [];

                    const cellLines: { start: number, end: number, text: string }[] = [];

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

                    for (; i > line + 1; i--)
                    {
                        // move each line down
                        replacements.push(
                            new Replacement(i,
                                cellLines[i - line].start,
                                cellLines[i - line].end,
                                cellLines[i - line - 1].text));
                    }

                    // blank the inserted line
                    replacements.push(
                        new Replacement(
                            line + 1,
                            cellLines[0].start,
                            cellLines[0].end,
                            " ".repeat(cellLines[0].end - cellLines[0].start)));

                    return this.makeReplacements(...replacements);
                });
        }
        else
        {
            promise = Promise.resolve(true);
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

            const remainingCellLine = text
                .substring(start, end)
                .trim();

            if (remainingCellLine !== "")
            {
                const cellStart = nthIndexOf(text, "|", activeCol + 1) + 2;

                promise
                    .then(() =>
                    {
                        return this.makeReplacements(
                            // replace remaining cell line with spaces
                            new Replacement(line, start, start + remainingCellLine.length, " ".repeat(remainingCellLine.length)),
                            // move remaining cell line to start of next cell line
                            new Replacement(line + 1, cellStart, cellStart + remainingCellLine.length, remainingCellLine));
                    })
                    .then(() =>
                    {
                        this.select(
                            line + 1,
                            cellStart);

                        return true;
                    });

                return;
            }
        }

        // select blank cell line
        promise.then(
            () =>
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