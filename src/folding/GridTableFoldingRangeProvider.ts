import * as vscode from "vscode";
import foldTable from "../gridtables/FoldTable";
import scanDocument from "../common/ScanDocument";
import getDocumentRange from "../common/GetDocumentRange";

export default class GridTableFoldingRangeProvider
    implements vscode.FoldingRangeProvider
{
    provideFoldingRanges(
        document: vscode.TextDocument,
        context: vscode.FoldingContext,
        token: vscode.CancellationToken):
        vscode.ProviderResult<vscode.FoldingRange[]>
    {
        return scanDocument(
            document,
            getDocumentRange(document),
            token,
            foldTable);
    }
}