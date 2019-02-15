import * as vscode from "vscode";
import { formatTable } from "../gridtables/FormatTable";

export class GridTableDocumentFormattingEditProvider
    implements vscode.DocumentFormattingEditProvider
{
    provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken):
        vscode.ProviderResult<vscode.TextEdit[]>
    {
        const edits: vscode.TextEdit[] = [];

        // find all tables
        for (let i = 0; i < document.lineCount; i++)
        {
            if (document.lineAt(i).text.startsWith("+-"))
            {
                // could be a grid table
                const result = formatTable(document, i);

                if (result.edits.length > 0)
                {
                    edits.push(...result.edits);
                }

                if (result.numberOfLines > 1)
                {
                    i += result.numberOfLines - 1;
                }
            }
        }

        return edits;
    }
}