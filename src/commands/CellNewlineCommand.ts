import * as vscode from "vscode";
import AbstractGridTableCommand from "./AbstractGridTableCommand";

export default class CellNewlineCommand
    extends AbstractGridTableCommand
{
    protected internalExecute(): void
    {
        const cellLine = this.columnWidths
            .map(w => "|" + " ".repeat(w - 1))
            .join("") +
            "|\n";

        const activeCol = this.activeColumn();

        let character = 2;

        for (let i = 0; i < activeCol; i++)
        {
            character += this.columnWidths[i];
        }

        this.insertAndMove(
            cellLine,
            1, 0,
            1, character,
            this.columnWidths[activeCol] - 3);
    }

    protected internalNotInGridTable(): void
    {
        this.insertAndMove(
            "\n",
            0, -1,
            1, 0);
    }

    private insertAndMove(
        value: string,
        insertLineOffset: number,
        insertCharacter: number,
        selectionLineOffset: number,
        selectionCharacter: number,
        selectionWidth: number = 0)
    {
        const pos = this.position();

        if (insertCharacter < 0)
        {
            insertCharacter = pos.character;
        }

        this.editor.edit((editBuilder: vscode.TextEditorEdit) =>
        {
            editBuilder.insert(
                new vscode.Position(
                    pos.line + insertLineOffset,
                    insertCharacter),
                value);
        });

        const s = new vscode.Position(
            pos.line + selectionLineOffset,
            selectionCharacter);

        const e = new vscode.Position(
            pos.line + selectionLineOffset,
            selectionCharacter + selectionWidth);

        this.editor.selection = new vscode.Selection(e, s);
    }
}