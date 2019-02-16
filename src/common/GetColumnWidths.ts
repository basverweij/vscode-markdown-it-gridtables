export default function getColumnWidths(
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