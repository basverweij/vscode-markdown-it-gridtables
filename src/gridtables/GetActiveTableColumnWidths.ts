import { getColumnWidths } from "markdown-it-gridtables";
import { IDocument } from "../interfaces/IDocument";

/**
 * getActiveTableColumnWidths returns the widths of the columns in the active 
 * table in the document.
 * 
 * @param doc The document in which to search for the active table.
 */
export function getActiveTableColumnWidths(
    doc: IDocument
): number[]
{
    const pos = doc.cursorPosition();

    // find first table line
    for (var tableStart = pos.line; tableStart > 0; tableStart--)
    {
        const firstChar = doc
            .lineAt(tableStart - 1)
            .charAt(0);

        if (firstChar !== "|" &&
            firstChar !== "+")
        {
            break;
        }
    }

    const startLine = doc.lineAt(tableStart);

    // check if we found a (probably) valid start line
    if (startLine.charAt(0) !== "+")
    {
        // invalid table
        return [];
    }

    // return the column widths
    return getColumnWidths(startLine);
}