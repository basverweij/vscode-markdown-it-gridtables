import * as vscode from 'vscode';
import scanDocument from '../common/ScanDocument';
import formatTable from '../gridtables/FormatTable';

export default class GridTableDocumentRangeFormattingEditProvider
    implements vscode.DocumentRangeFormattingEditProvider
{
    provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument,
        range: vscode.Range,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken):
        vscode.ProviderResult<vscode.TextEdit[]>
    {
        return scanDocument(
            document,
            range,
            token,
            formatTable);
    }
}