import * as vscode from "vscode";
import formatTable from "../gridtables/FormatTable";
import scanDocument from "../common/ScanDocument";
import getDocumentRange from "../common/GetDocumentRange";

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
            getDocumentRange(document),
            token,
            formatTable);
    }
}