import * as vscode from "vscode";
import AbstractGridTableCommand from "./AbstractGridTableCommand";
import ColumnAlignments from "../common/ColumnAlignments";
import getTableStartLine from "../gridtables/GetTableStartLine";
import getTableHeaderLine from "../gridtables/GetTableHeaderLine";
import nthIndexOf from "../common/NthIndexOf";
import { Replacement } from "./AbstractCommand";

export default class SetColumnAlignmentCommand
    extends AbstractGridTableCommand
{
    constructor(
        editor: vscode.TextEditor,
        private readonly alignment: ColumnAlignments)
    {
        super(editor);
    }

    protected internalExecute(): void
    {
        // get line with column alignments
        const doc = this.editor.document;

        const startLineNumber = getTableStartLine(
            doc,
            this.position());

        if (startLineNumber === -1)
        {
            // invalid table
            this.warning("Table start line not found");

            return;
        }

        let lineNumber = getTableHeaderLine(
            doc,
            startLineNumber);

        let line = doc
            .lineAt(lineNumber)
            .text;

        let lineChar = "=";

        if (line.indexOf("=") < 0)
        {
            // table does not have a header line: use the start line to set the column alignment
            lineNumber = startLineNumber;

            line = doc
                .lineAt(lineNumber)
                .text;

            lineChar = "-";
        }

        // find active column
        const activeCol = this.activeColumn(true);

        const colStart = nthIndexOf(line, "+", activeCol + 1);

        const colEnd = nthIndexOf(line, "+", activeCol + 2);

        if ((colStart === -1) ||
            (colEnd === -1) ||
            (colEnd - 1 <= colStart + 1))
        {
            this.warning("Invalid Grid Table");

            return;
        }

        const colAlignment = getColumnAlignment(
            lineChar,
            this.alignment);

        this.makeReplacements(
            new Replacement(lineNumber, colStart + 1, colStart + 2, colAlignment[0]),
            new Replacement(lineNumber, colEnd - 1, colEnd, colAlignment[1]),
        );
    }
}

function getColumnAlignment(
    lineChar: string,
    alignment: ColumnAlignments
): string[]
{
    switch (alignment)
    {
        case ColumnAlignments.Left:
            return [":", lineChar];

        case ColumnAlignments.Center:
            return [":", ":"];

        case ColumnAlignments.Right:
            return [lineChar, ":"];
    }

    return [lineChar, lineChar];
}