import ITextLine from "./ITextLine";

export default interface ITextDocument
{
    /**
     * Returns a text line denoted by the line number.
     *
     * @param line A line number in [0, lineCount).
     * @return A [line](#ITextLine).
     */
    lineAt(line: number): ITextLine;

    /**
     * The number of lines in this document.
     */
    lineCount: number;
}