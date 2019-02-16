import * as vscode from "vscode";

type TScanner<T> = (
    document: vscode.TextDocument,
    line: number,
    aggregator: (item: T) => void) =>
    number;

export default function scanDocument<T>(
    document: vscode.TextDocument,
    token: vscode.CancellationToken,
    scanner: TScanner<T>):
    T[]
{
    const items: T[] = [];

    // find all grid tables
    for (let i = 0; i < document.lineCount; i++)
    {
        if (token.isCancellationRequested)
        {
            break;
        }

        const line = document.lineAt(i).text;

        if (line.startsWith("+-") ||
            line.startsWith("+:-"))
        {
            // could be a grid table
            const linesScanned = scanner(
                document,
                i,
                (item: T) => items.push(item));

            if (linesScanned > 1)
            {
                i += linesScanned - 1;
            }
        }
    }

    return items;
}