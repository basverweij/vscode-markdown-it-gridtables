import * as vscode from "vscode";
import AbstractGridTableCommand from "./AbstractGridTableCommand";
import nthIndexOf from "../common/NthIndexOf";
import { posix } from "path";

export default class CellNewlineCommand
    extends AbstractGridTableCommand
{
    protected internalExecute(): void
    {
        const pos = this.position();

        const activeCol = this.activeColumn();

        if (this.shouldInsertCellLine(pos, activeCol))
        {
            // insert cell new line
            const cellLine = this.columnWidths
                .map(w => "|" + " ".repeat(w - 1))
                .join("") +
                "|\n";

            this.insertText(
                cellLine,
                pos.line + 1,
                0);
        }

        // get column start character
        const line = this.editor
            .document
            .lineAt(pos.line)
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
            pos.line + 1,
            fromCharacter,
            toCharacter - fromCharacter);
    }

    protected internalNotInGridTable(): void
    {
        const pos = this.position();

        this.insertText(
            "\n",
            pos.line,
            pos.character);

        this.select(
            pos.line + 1,
            0);
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
        character: number)
    {
        this.editor.edit((editBuilder: vscode.TextEditorEdit) =>
        {
            editBuilder.insert(
                new vscode.Position(
                    line,
                    character),
                text);
        });
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