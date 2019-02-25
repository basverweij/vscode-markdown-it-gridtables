import ITextDocument from "../interfaces/ITextDocument";
import IPosition from "../interfaces/IPosition";
import getColumnWidths from "../common/GetColumnWidths";
import getTableStartLine from "./GetTableStartLine";

/**
 * getActiveTableColumnWidths returns the widths of the columns in the active 
 * table in the document.
 * 
 * @param doc The document in which to search for the active table.
 * @param pos The position to start searching from.
 */
export default function getActiveTableColumnWidths(
    doc: ITextDocument,
    pos: IPosition
): number[]
{
    const tableStart = getTableStartLine(
        doc,
        pos);

    if (tableStart === -1)
    {
        // invalid table
        return [];
    }

    const startLine = doc
        .lineAt(tableStart)
        .text;

    // return the column widths
    return getColumnWidths(startLine);
}