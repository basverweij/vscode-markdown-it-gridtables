import * as vscode from "vscode";
import AbstractInsertCommand from "./AbstractInsertCommand";
import nthIndexOf from "../common/NthIndexOf";

export default class CellTabCommand
    extends AbstractInsertCommand
{
    protected internalExecute(): void
    {
        const pos = this.position();

        let lineNumber = pos.line;

        if (!this.editor
            .document
            .lineAt(lineNumber)
            .text
            .startsWith("|"))
        {
            // not a cell line
            return;
        }

        let activeCol = this.activeColumn();

        // make sure that the index is set to a valid column
        if (activeCol < 0)
        {
            activeCol = 0;
        }
        else if (activeCol >= this.columnWidths.length)
        {
            activeCol = this.columnWidths.length - 1;
        }

        if (this.insertBelow)
        {
            activeCol++;

            if (activeCol === this.columnWidths.length)
            {
                // move to next line, first column
                activeCol = 0;
                lineNumber = this.findLine(lineNumber, 1);
            }
        }
        else
        {
            activeCol--;

            if (activeCol === -1)
            {
                // move to previous line, last column
                activeCol = this.columnWidths.length - 1;
                lineNumber = this.findLine(lineNumber, -1);
            }
        }

        if (lineNumber === -1)
        {
            // not able to move to previous/next column line
            return;
        }

        const line = this.editor
            .document
            .lineAt(lineNumber)
            .text;

        let fromCharacter = nthIndexOf(
            line,
            "|",
            activeCol + 1)
            + 2;

        let toCharacter = nthIndexOf(
            line,
            "|",
            activeCol + 2)
            - 1;

        this.select(
            lineNumber,
            fromCharacter,
            toCharacter - fromCharacter);
    }

    private findLine(
        lineNumber: number,
        delta: number
    ): number
    {
        const doc = this.editor.document;

        for (lineNumber += delta; lineNumber >= 0 && lineNumber < doc.lineCount; lineNumber += delta)
        {
            const line = doc
                .lineAt(lineNumber)
                .text;

            if (line.startsWith("|"))
            {
                return lineNumber;
            }

            if (!line.startsWith("+"))
            {
                break;
            }
        }

        return -1;
    }

    protected internalNotInGridTable(): void
    {
        if (this.insertBelow)
        {
            this.handleTab();
        }
        else
        {
            this.handleShiftTab();
        }
    }

    private handleTab(): void
    {
        // insert tab
        const pos = this.position();

        const tabSize = this.editor.options.tabSize as number;

        const value = this.editor.options.insertSpaces ?
            " ".repeat(tabSize) :
            "\t";

        this.editor.edit(
            (editBuilder) =>
            {
                editBuilder.insert(
                    pos,
                    value);
            });
    }

    private handleShiftTab(): void
    {
        // outdent line
        let pos = this.position();

        const line = this.editor
            .document
            .lineAt(pos.line)
            .text;

        const prefix = line.match(/^([ \t]+)/);

        if ((prefix === null) ||
            (prefix[1].length === 0))
        {
            // line is not indented
            return;
        }

        pos = new vscode.Position(
            pos.line,
            prefix[1].length);

        const tabSize = this.editor.options.tabSize as number;

        let outdentSize = prefix[1].length % tabSize;

        if (outdentSize === 0)
        {
            // exactly on a tab size multiple -> outdent full tab size
            outdentSize = tabSize;
        }

        this.editor.edit(
            (editBuilder) =>
            {
                editBuilder.delete(
                    new vscode.Range(
                        new vscode.Position(pos.line, pos.character - outdentSize),
                        pos));
            });
    }
}