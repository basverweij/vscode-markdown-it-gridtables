import ITextDocument from "../interfaces/ITextDocument";
import IPosition from "../interfaces/IPosition";

export default function getTableStartLine(
    doc: ITextDocument,
    pos: IPosition
): number
{
    if (!isTableLine(doc, pos.line))
    {
        // not in a table
        return -1;
    }

    // scan for first non-table line
    for (var tableStart = pos.line; tableStart > 0; tableStart--)
    {
        if (!isTableLine(doc, tableStart - 1))
        {
            break;
        }
    }

    const startLine = doc
        .lineAt(tableStart)
        .text;

    // check if we found a (probably) valid start line
    if (startLine.charAt(0) !== "+")
    {
        // invalid table
        return -1;
    }

    return tableStart;
}

function isTableLine(
    doc: ITextDocument,
    lineNumber: number
): boolean
{
    const firstChar = doc
        .lineAt(lineNumber)
        .text
        .charAt(0);

    return firstChar === "|" ||
        firstChar === "+";
}