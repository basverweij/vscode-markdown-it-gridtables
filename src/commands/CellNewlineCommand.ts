import * as vscode from "vscode";
import AbstractGridTableCommand from "./AbstractGridTableCommand";
import nthIndexOf from "../common/NthIndexOf";

export default class CellNewlineCommand
    extends AbstractGridTableCommand
{
    protected internalExecute(): void
    {
        const pos = this.position();

        const activeCol = this.activeColumn();

        let promise: Promise<void>;

        if (this.shouldInsertCellLine(pos, activeCol))
        {
            // insert cell new line
            const cellLine = this.columnWidths
                .map(w => "|" + " ".repeat(w - 1))
                .join("") +
                "|\n";

            promise = this.insertText(
                cellLine,
                pos.line + 1,
                0);
        }
        else
        {
            promise = Promise.resolve();
        }

        promise.then(
            () =>
            {
                // get column start character
                const line = this.editor
                    .document
                    .lineAt(pos.line + 1)
                    .text;

                const columnChar = line.indexOf("+") >= 0 ?
                    "+" :
                    "|";

                let fromCharacter = nthIndexOf(
                    line,
                    columnChar,
                    activeCol + 1)
                    + 2;

                let toCharacter = nthIndexOf(
                    line,
                    columnChar,
                    activeCol + 2)
                    - 1;

                this.select(
                    pos.line + 1,
                    fromCharacter,
                    toCharacter - fromCharacter);
            });
    }

    private shouldInsertCellLine(
        pos: vscode.Position,
        activeCol: number
    ): boolean
    {
        if (pos.line === this.editor.document.lineCount - 1)
        {
            // last line
            return true;
        }

        const nextLine = this.editor
            .document
            .lineAt(pos.line + 1)
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

    private insertText(
        text: string,
        line: number,
        character: number
    ): Promise<void>
    {
        const promise = new Promise<void>(
            (resolve, _) => 
            {
                this.editor.edit((editBuilder: vscode.TextEditorEdit) =>
                {
                    editBuilder.insert(
                        new vscode.Position(
                            line,
                            character),
                        text);

                    resolve();
                });
            });

        return promise;
    }

    private select(
        line: number,
        character: number,
        width: number = 0)
    {
        // start at the end, so that the cursor is positioned correctly
        const from = new vscode.Position(
            line,
            character + width);

        const to = new vscode.Position(
            line,
            character);

        this.editor.selection = new vscode.Selection(from, to);
    }
}