import nthIndexOf from "../common/NthIndexOf";
import AbstractCellCommand from "./AbstractCellCommand";

export default class CellNewlineCommand
    extends AbstractCellCommand
{
    protected internalCellExecute(): void
    {
        if (this.atStartOfTable())
        {
            // only insert newline
            this.newEdit()
                .insert(this.position().line, 0, this.eol())
                .complete();

            return;
        }

        const line = this
            .position()
            .line;

        const activeCol = this.activeColumn(true);

        const edit = this.newEdit();

        if (this.shouldInsertCellLine())
        {
            // get last cell line
            const lastCellLine = this.cellLines[this.cellLines.length - 2];

            // only insert a new line before the separator if the last cell line is not empty,
            // or if we are on the list just before the separator
            if ((lastCellLine.text.trim() !== "") ||
                (this.cellLines.length === 2))
            {
                // build empty cell line
                const cellLine = this.columnWidths
                    .map(w => "|" + " ".repeat(w - 1))
                    .join("") +
                    "|" +
                    this.eol();

                edit.insert(
                    this.separatorLine,
                    0,
                    cellLine.substring(0, lastCellLine.start) +
                    lastCellLine.text + // include the last cell line when inserting
                    cellLine.substring(lastCellLine.end));

                edit.perform();
            }

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

    private atStartOfTable(): boolean
    {
        const pos = this.position();

        if (pos.character > 0)
        {
            // not a the beginning of a line
            return false;
        }

        if (!this.editor.document.lineAt(pos.line).text.startsWith("+"))
        {
            // not a separator line
            return false;
        }

        return (pos.line === 0) || // first line in the document
            !this.editor.document.lineAt(pos.line - 1).text.startsWith("|"); // not a table line
    }
}