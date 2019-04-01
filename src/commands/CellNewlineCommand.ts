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

        this.ensureBlankCellLines(edit, 1);

        // check if we need to replace part of the current cell line
        const text = this
            .editor
            .document
            .lineAt(line)
            .text;

        // only break cell lines
        if (text.startsWith("|"))
        {
            let start = this.position().character;

            if (text.charAt(start) === "|")
            {
                // we normalize character position at a cell separator as the next column,
                // but we don't want to copy this separator
                start++;
            }

            let end = nthIndexOf(text, "|", activeCol + 2);

            if (text.charAt(end) === "|")
            {
                // don't copy the cell separator at the end of a cell
                end--;
            }

            if (end > start)
            {
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