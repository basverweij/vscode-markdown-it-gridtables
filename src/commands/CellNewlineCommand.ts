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

        this.insertLines(edit, ["", ""]);

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

                if (text.substring(fromCharacter, toCharacter).trim() === "")
                {
                    // select inserted blank lines
                    this.select(
                        line + 1,
                        fromCharacter,
                        toCharacter - fromCharacter);
                }
                else
                {
                    // insert cursor on cell start
                    this.select(
                        line + 1,
                        fromCharacter,
                        0);
                }
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