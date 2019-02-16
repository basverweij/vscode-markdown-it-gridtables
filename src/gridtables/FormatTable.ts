import * as vscode from "vscode";
import ITextDocument from "../interfaces/ITextDocument";
import getColumnWidths from "../common/GetColumnWidths";
import nthIndexOf from "../common/NthIndexOf";

export default function formatTable(
    document: ITextDocument,
    startLine: number,
    aggregator: (item: vscode.TextEdit) => void):
    number
{
    // first line determines the column count,
    // and does not need to be trimmed as it is always a separator line,
    // minimum width is always 3
    const maxColumnWidths = getColumnWidths(
        document
            .lineAt(startLine)
            .text)
        .map(_ => 3);

    if (maxColumnWidths.length === 0)
    {
        return 0;
    }

    let linesScanned = 0;

    for (let i = startLine + 1; i < document.lineCount; i++)
    {
        const line = document
            .lineAt(i)
            .text;

        // use trimmed widths when determining the max column widths
        let columnWidths = getColumnWidths(line, true);

        if (columnWidths.length !== maxColumnWidths.length)
        {
            // column counts don't match -> stop checking
            linesScanned = i - startLine;

            break;
        }

        if (!line.startsWith("|"))
        {
            // only check the width of cells
            continue;
        }

        // combine with max column widths
        for (let j = 0; j < maxColumnWidths.length; j++)
        {
            if (maxColumnWidths[j] < columnWidths[j])
            {
                maxColumnWidths[j] = columnWidths[j];
            }
        }
    }

    // go through the table again and adjust all lines to the max column widths
    for (let i = startLine; i < startLine + linesScanned; i++)
    {
        const line = document
            .lineAt(i)
            .text;

        // get both full and trimmed widths
        let columnWidths = getColumnWidths(line);

        let columnChar: string;
        let insertChar: string;

        if (line.startsWith("|"))
        {
            // get trimmed widths for cell lines
            columnChar = "|";
            insertChar = " ";
        }
        else
        {
            // trimmed widths are equal for separator lines
            columnChar = "+";
            insertChar =
                line.startsWith("+-") ||
                    line.startsWith("+:-") ?
                    "-" :
                    "=";
        }

        // check against max column widths
        for (let j = 0; j < maxColumnWidths.length; j++)
        {
            if (columnChar === "|")
            {
                // get cell start position
                const k = nthIndexOf(
                    line,
                    columnChar, j + 1)
                    + 1;

                if (line.charAt(k) !== " ")
                {
                    // ensure space at beginning of cell
                    const p = new vscode.Position(i, k);

                    aggregator(
                        vscode.TextEdit
                            .insert(p, " "));
                }
            }

            // get cell end position
            const k = nthIndexOf(
                line,
                columnChar, j + 2) -
                (columnChar === "|" ?
                    0 :
                    1); // skip optional alignment indicator

            if (maxColumnWidths[j] > columnWidths[j])
            {
                const p = new vscode.Position(i, k);

                const s = insertChar.repeat(maxColumnWidths[j] - columnWidths[j]);

                aggregator(
                    vscode.TextEdit
                        .insert(p, s));
            }
            else if (maxColumnWidths[j] < columnWidths[j])
            {
                const s = new vscode.Position(
                    i,
                    k - (columnWidths[j] - maxColumnWidths[j]));

                const e = new vscode.Position(i, k);

                aggregator(
                    vscode.TextEdit
                        .delete(new vscode.Range(s, e)));
            }
        }
    }

    return linesScanned;
}