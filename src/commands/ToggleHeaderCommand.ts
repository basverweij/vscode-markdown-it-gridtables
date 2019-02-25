import * as vscode from "vscode";
import AbstractGridTableCommand from "./AbstractGridTableCommand";
import getTableStartLine from "../gridtables/GetTableStartLine";
import { start } from "repl";

export default class ToggleHeaderCommand
    extends AbstractGridTableCommand
{
    protected internalExecute(): void
    {
        const doc = this.editor.document;

        const pos = this.position();

        const tableStart = getTableStartLine(
            doc,
            pos);

        if (tableStart === -1)
        {
            // invalid table
            this.warning("Table start line not found");

            return;
        }

        for (let i = tableStart + 2; i < doc.lineCount; i++)
        {
            const line = doc
                .lineAt(i)
                .text;

            if (line.startsWith("+"))
            {
                // first separator line after the table start line
                this.toggleHeader(
                    doc,
                    tableStart,
                    i,
                    line);

                return;
            }
        }

        this.warning("Table header line not found");
    }

    private toggleHeader(
        doc: vscode.TextDocument,
        startLineNumber: number,
        headerLineNumber: number,
        headerLine: string)
    {
        const replacements: LineReplacement[] = [];

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
                // start line contains alignments: move to header line
                replacements.push(
                    new LineReplacement(
                        headerLineNumber,
                        startLine.replace(/[-]/g, "=")));
            }

            replacements.push(
                new LineReplacement(
                    startLineNumber,
                    startLine.replace(/[:]/g, "-")));
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