import * as vscode from "vscode";

export class FormatTableResult
{
    edits: vscode.TextEdit[] = [];

    numberOfLines: number = 0;
}

export function formatTable(
    document: vscode.TextDocument,
    startLine: number):
    FormatTableResult
{
    const result = new FormatTableResult();

    // first line determines the column count
    const maxColumnWidths = getColumnWidths(document.lineAt(startLine).text);

    if (maxColumnWidths.length === 0)
    {
        return result;
    }

    for (let i = startLine + 1; i < document.lineCount; i++)
    {
        let columnWidths = getColumnWidths(document.lineAt(i).text);

        if (columnWidths.length !== maxColumnWidths.length)
        {
            // column counts don't match -> stop checking
            result.numberOfLines = i - startLine;
            break;
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
    for (let i = startLine + 1; i < document.lineCount; i++)
    {
        const line = document.lineAt(i).text;

        let columnWidths = getColumnWidths(line);

        if (columnWidths.length !== maxColumnWidths.length)
        {
            // column counts don't match
            break;
        }

        // check against max column widths
        for (let j = 0; j < maxColumnWidths.length; j++)
        {
            if (maxColumnWidths[j] > columnWidths[j])
            {
                // TODO create edit to resize column

                const p = new vscode.Position(i, getNthIndexOf(line, "|", j + 1) - 2);

                // TODO check if we are in a separator line 
                const s = " ".repeat(maxColumnWidths[j] - columnWidths[j]);

                result.edits.push(
                    vscode.TextEdit.insert(p, s));
            }
        }
    }

    return result;
}

function getColumnWidths(
    line: string):
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
        const columnMatch = line
            .substr(1)
            .match(/[^|]{3,}\|/g);

        if (columnMatch !== null)
        {
            return columnMatch.map(s => s.length);
        }
    }

    return [];
}

function getNthIndexOf(
    value: string,
    searchString: string,
    count: number):
    number
{

    let index = value.indexOf(searchString);

    for (let i = 1; i < count; i++)
    {
        index = value.indexOf(searchString, index + 1);
    }

    return index;
}