import * as vscode from "vscode";
import AbstractGridTableCommand from "./AbstractGridTableCommand";
import getTableStartLine from "../gridtables/GetTableStartLine";
import getTableHeaderLine from "../gridtables/GetTableHeaderLine";

export default class ToggleHeaderCommand
    extends AbstractGridTableCommand
{
    protected internalExecute(): void
    {
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

        const headerLineNumber = getTableHeaderLine(
            doc,
            startLineNumber);

        if (headerLineNumber === -1)
        {
            // header line not found
            this.warning("Table header line not found");

            return;
        }

        this.toggleHeader(
            doc,
            startLineNumber,
            headerLineNumber);
    }

    private toggleHeader(
        doc: vscode.TextDocument,
        startLineNumber: number,
        headerLineNumber: number)
    {
        const replacements: LineReplacement[] = [];

        const headerLine = doc
            .lineAt(headerLineNumber)
            .text;

        if (headerLine.indexOf("=") >= 0)
        {
            // header is currently on

            if (headerLine.indexOf(":") >= 0)
            {
                // header line contains alignments: move to start line
                replacements.push(
                    new LineReplacement(
                        startLineNumber,
                        headerLine.replace(/[=]/g, "-")));
            }

            replacements.push(
                new LineReplacement(
                    headerLineNumber,
                    headerLine.replace(/[=:]/g, "-")));
        }
        else
        {
            // header is currently off
            const startLine = doc
                .lineAt(startLineNumber)
                .text;

            if (startLine.indexOf(":") >= 0)
            {
                // remove alignments from start line
                replacements.push(
                    new LineReplacement(
                        startLineNumber,
                        startLine.replace(/[:]/g, "-")));
            }

            replacements.push(
                new LineReplacement(
                    headerLineNumber,
                    startLine.replace(/[-]/g, "=")));
        }

        this.makeReplacements(...replacements);
    }

    private makeReplacements(
        ...replacements: LineReplacement[])
    {
        this.editor.edit((
            editBuilder: vscode.TextEditorEdit
        ) =>
        {
            replacements.forEach(r => 
            {
                const line = this
                    .editor
                    .document
                    .lineAt(r.lineNumber)
                    .text;

                const range = new vscode.Range(
                    new vscode.Position(r.lineNumber, 0),
                    new vscode.Position(r.lineNumber, line.length));

                editBuilder.replace(range, r.value);
            });
        });
    }
}

class LineReplacement
{
    constructor(
        public lineNumber: number,
        public value: string)
    { }
}