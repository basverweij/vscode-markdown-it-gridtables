import AbstractGridTableCommand from "./AbstractGridTableCommand";
import nthIndexOf from "../common/NthIndexOf";

export default abstract class AbstractCellCommand
    extends AbstractGridTableCommand
{
    protected cellLines: { start: number, end: number, text: string }[] = [];

    protected separatorLine: number = -1;

    protected internalExecute(): void
    {
        const line = this
            .position()
            .line;

        const activeCol = this.activeColumn(true);

        // find next separator line
        this.separatorLine = line + 1;
        for (; this.separatorLine < this.editor.document.lineCount; this.separatorLine++)
        {
            const text = this.editor.document.lineAt(this.separatorLine).text;

            if (text.startsWith("+"))
            {
                break;
            }

            if (!text.startsWith("|"))
            {
                // outside grid table
                return;
            }
        }

        // build cell lines
        for (let i = line; i <= this.separatorLine; i++)
        {
            const text = this.editor.document.lineAt(i).text;

            const columnChar = text.startsWith("|") ?
                "|" :
                "+";

            const start = nthIndexOf(text, columnChar, activeCol + 1) + 1;

            const end = nthIndexOf(text, columnChar, activeCol + 2);

            this.cellLines.push(
                {
                    start: start,
                    end: end,
                    text: text.substring(start, end),
                });
        }

        this.internalCellExecute();
    }

    protected abstract internalCellExecute(): void;

    protected shouldInsertCellLine(): boolean
    {
        return (this.cellLines.length === 2) || // directly above the separator
            (this.cellLines[1].text.trim() !== ""); // next line is not empty
    }
}