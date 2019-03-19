import AbstractInsertCommand from "./AbstractInsertCommand";
import nthIndexOf from "../common/NthIndexOf";

export default class CellMoveLineCommand
    extends AbstractInsertCommand
{
    protected internalExecute(): void
    {
        let line = this
            .position()
            .line;

        if (!this.editor
            .document
            .lineAt(line)
            .text
            .startsWith("|"))
        {
            // not a cell line
            return;
        }

        let activeCol = this.activeColumn(true);

        if (this.insertBelow)
        {
            line++;
        }
        else
        {
            line--;
        }

        if ((line < 0) ||
            (line >= this.editor.document.lineCount) ||
            !this.editor.document.lineAt(line).text.startsWith("|"))
        {
            // not a cell line
            return;
        }

        const text = this.editor
            .document
            .lineAt(line)
            .text;

        let fromCharacter = nthIndexOf(
            text,
            "|",
            activeCol + 1)
            + 2;

        let toCharacter = nthIndexOf(
            text,
            "|",
            activeCol + 2)
            - 1;

        this.select(
            line,
            fromCharacter,
            toCharacter - fromCharacter);
    }
}