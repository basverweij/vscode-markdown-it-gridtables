import * as vscode from "vscode";
import formatTable from "../gridtables/FormatTable";
import scanDocument from "../common/ScanDocument";

export default class GridTableDocumentFormattingEditProvider
    implements vscode.DocumentFormattingEditProvider
{
    provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken):
        vscode.ProviderResult<vscode.TextEdit[]>
    {
        return scanDocument(
            document,
            token,
            formatTable);
    }
}