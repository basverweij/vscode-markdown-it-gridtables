import ITextDocument from "../interfaces/ITextDocument";
import IPosition from "../interfaces/IPosition";
import getColumnWidths from "../common/GetColumnWidths";

/**
 * getActiveTableColumnWidths returns the widths of the columns in the active 
 * table in the document.
 * 
 * @param doc The document in which to search for the active table.
 */
export default function getActiveTableColumnWidths(
    doc: ITextDocument,
    pos: IPosition
): number[]
{
    // find first table line
    for (var tableStart = pos.line; tableStart > 0; tableStart--)
    {
        const firstChar = doc
            .lineAt(tableStart - 1)
            .text
            .charAt(0);

        if (firstChar !== "|" &&
            firstChar !== "+")
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
        return [];
    }

    // return the column widths
    return getColumnWidths(startLine);
}