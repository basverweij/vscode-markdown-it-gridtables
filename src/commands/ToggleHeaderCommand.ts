import * as vscode from "vscode";
import AbstractGridTableCommand from "./AbstractGridTableCommand";
import getTableStartLine from "../gridtables/GetTableStartLine";
import getTableHeaderLine from "../gridtables/GetTableHeaderLine";
import { Replacement } from "./AbstractCommand";

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
        const replacements: Replacement[] = [];

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
                    new Replacement(
                        startLineNumber,
                        0,
                        headerLine.length,
                        headerLine.replace(/[=]/g, "-")));
            }

            replacements.push(
                new Replacement(
                    headerLineNumber,
                    0,
                    headerLine.length,
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
                    new Replacement(
                        startLineNumber,
                        0,
                        startLine.length,
                        startLine.replace(/[:]/g, "-")));
            }

            replacements.push(
                new Replacement(
                    headerLineNumber,
                    0,
                    startLine.length,
                    startLine.replace(/[-]/g, "=")));
        }

        this.makeReplacements(...replacements);
    }
}