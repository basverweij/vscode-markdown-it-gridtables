import * as vscode from "vscode";
import ITextDocument from "../interfaces/ITextDocument";

export default function foldTable(
    document: ITextDocument,
    startLine: number,
    aggregator: (item: vscode.FoldingRange) => void):
    number
{
    return 0;
}