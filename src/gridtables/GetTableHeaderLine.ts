import ITextDocument from "../interfaces/ITextDocument";

export default function getTableHeaderLine(
    doc: ITextDocument,
    startLineNumber: number
): number
{
    for (let i = startLineNumber + 2; i < doc.lineCount; i++)
    {
        const line = doc
            .lineAt(i)
            .text;

        if (line.startsWith("+"))
        {
            // header line is the first separator line after the start line
            return i;
        }
    }

    // header line not found
    return -1;
}