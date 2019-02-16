import * as vscode from "vscode";
import ITextDocument from "../interfaces/ITextDocument";
import getColumnWidths from "../common/GetColumnWidths";

export default function foldTable(
    document: ITextDocument,
    startLine: number,
    aggregator: (item: vscode.FoldingRange) => void):
    number
{
    const columnCount = getColumnWidths(
        document
            .lineAt(startLine)
            .text)
        .length;

    if (columnCount === 0)
    {
        return 0;
    }

    let linesScanned = 0;

    let rowStartLine = startLine;

    for (let i = startLine + 1; i < document.lineCount; i++)
    {
        const line = document
            .lineAt(i)
            .text;

        if (getColumnWidths(line).length !== columnCount)
        {
            linesScanned = i - startLine;

            break;
        }

        if (!line.startsWith("+"))
        {
            continue;
        }

        // emit folding range for the current row
        aggregator(
            new vscode.FoldingRange(
                rowStartLine + 1,
                i,
                vscode.FoldingRangeKind.Region));

        rowStartLine = i;
    }

    // emit folding range for whole table
    aggregator(
        new vscode.FoldingRange(
            startLine,
            startLine + linesScanned - 1,
            vscode.FoldingRangeKind.Region));

    return linesScanned;
}