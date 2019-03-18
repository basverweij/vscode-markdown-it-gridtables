import AbstractInsertCommand from "./AbstractInsertCommand";
import nthIndexOf from "../common/NthIndexOf";

export default class CellTabCommand
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

        let activeCol = this.activeColumn();

        // normalize the column index
        if (activeCol < 0)
        {
            activeCol = -1;
        }
        else if (activeCol >= this.columnWidths.length)
        {
            activeCol = this.columnWidths.length;
        }

        if (this.insertBelow)
        {
            activeCol++;

            if (activeCol >= this.columnWidths.length)
            {
                // move to next line, first column
                activeCol = 0;
                line = this.findLine(line, 1);
            }
        }
        else
        {
            activeCol--;

            if (activeCol < 0)
            {
                // move to previous line, last column
                activeCol = this.columnWidths.length - 1;
                line = this.findLine(line, -1);
            }
        }

        if (line === -1)
        {
            // not able to move to previous/next column line
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

    private findLine(
        line: number,
        delta: number
    ): number
    {
        const doc = this.editor.document;

        for (line += delta; line >= 0 && line < doc.lineCount; line += delta)
        {
            const text = doc
                .lineAt(line)
                .text;

            if (text.startsWith("|"))
            {
                return line;
            }

            if (!text.startsWith("+"))
            {
                break;
            }
        }

        return -1;
    }
}