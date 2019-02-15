import * as vscode from "vscode";

export default function formatTable(
    document: vscode.TextDocument,
    startLine: number):
    FormatTableResult
{
    const result = new FormatTableResult();

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
        return result;
    }

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
            result.numberOfLines = i - startLine;

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
    for (let i = startLine; i < startLine + result.numberOfLines; i++)
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
                const k = getNthIndexOf(line, columnChar, j + 1) + 1;

                if (line.charAt(k) !== " ")
                {
                    // ensure space at beginning of cell
                    const p = new vscode.Position(i, k);

                    result.edits.push(
                        vscode.TextEdit.insert(p, " "));
                }
            }

            // get cell end position
            const k = getNthIndexOf(line, columnChar, j + 2) -
                (columnChar === "|" ?
                    0 :
                    1); // skip possible alignment indicator

            if (maxColumnWidths[j] > columnWidths[j])
            {
                const p = new vscode.Position(i, k);

                const s = insertChar.repeat(maxColumnWidths[j] - columnWidths[j]);

                result.edits.push(
                    vscode.TextEdit.insert(p, s));
            }
            else if (maxColumnWidths[j] < columnWidths[j])
            {
                const s = new vscode.Position(
                    i,
                    k - (columnWidths[j] - maxColumnWidths[j]));

                const e = new vscode.Position(i, k);

                result.edits.push(
                    vscode.TextEdit.delete(new vscode.Range(s, e)));
            }
        }
    }

    return result;
}

class FormatTableResult
{
    edits: vscode.TextEdit[] = [];

    numberOfLines: number = 0;
}

function getColumnWidths(
    line: string,
    trimCells: boolean = false):
    number[]
{
    if (line.startsWith("+"))
    {
        // try to parse as a row separator line
        let columnMatch = line
            .substr(1)
            .match(/[:-][-]+[:-]\+/g);

        if (columnMatch !== null)
        {
            return columnMatch.map(s => s.length);
        }

        // try to parse as a header separator line
        columnMatch = line
            .substr(1)
            .match(/[:=][=]+[:=]\+/g);

        if (columnMatch !== null)
        {
            return columnMatch.map(s => s.length);
        }
    }
    else if (line.startsWith("|"))
    {
        // try to parse as a cell line
        let columnMatch = line
            .substr(1)
            .match(/[^|]+\|/g);

        if (columnMatch !== null)
        {
            // ensure that each cell starts with a space
            columnMatch = columnMatch.map(s =>
                s.startsWith(" ") ?
                    s :
                    " " + s);

            if (trimCells)
            {
                columnMatch = columnMatch.map(s =>
                {
                    if (s.length > 1)
                    {
                        // skip first char (always a space),
                        // and last char (always a vertical pipe),
                        // trim the rest from the right
                        s = s
                            .substr(1, s.length - 2)
                            .trimRight();
                    }

                    if (s.length < 1)
                    {
                        s = " ";
                    }

                    return " " + s + " |";
                });
            }

            return columnMatch.map(s => s.length);
        }
    }

    return [];
}

function getNthIndexOf(
    value: string,
    searchString: string,
    nth: number = 1):
    number
{
    let index = value.indexOf(searchString);

    for (let i = 1; i < nth; i++)
    {
        index = value.indexOf(searchString, index + 1);
    }

    return index;
}