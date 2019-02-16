import * as vscode from "vscode";

type TScanner<T> = (
    document: vscode.TextDocument,
    line: number,
    aggregator: (item: T) => void) =>
    number;

export default function scanDocument<T>(
    document: vscode.TextDocument,
    range: vscode.Range,
    token: vscode.CancellationToken,
    scanner: TScanner<T>):
    T[]
{
    const items: T[] = [];

    let startLine = range.start.line;

    if (startLine > 0)
    {
        // expand range to include complete table
        for (; startLine > 0; startLine--)
        {
            if (token.isCancellationRequested)
            {
                return [];
            }

            const line = document.lineAt(startLine).text;

            if (!isSeparatorLine(line) &&
                !isCellLine(line))
            {
                break;
            }
        }
    }

    let endLine = range.end.line;

    if (endLine < document.lineCount - 1)
    {
        // expand range to include complete table
        for (; endLine < document.lineCount - 1; endLine++)
        {
            if (token.isCancellationRequested)
            {
                return [];
            }

            const line = document.lineAt(endLine).text;

            if (!isSeparatorLine(line) &&
                !isCellLine(line))
            {
                break;
            }
        }
    }

    // find all grid tables
    for (let i = startLine; i <= endLine; i++)
    {
        if (token.isCancellationRequested)
        {
            break;
        }

        const line = document.lineAt(i).text;

        if (isSeparatorLine(line))
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

function isSeparatorLine(
    line: string
): boolean
{
    return line.startsWith("+-") ||
        line.startsWith("+:-");
}

function isCellLine(
    line: string
): boolean
{
    return line.startsWith("|");
}