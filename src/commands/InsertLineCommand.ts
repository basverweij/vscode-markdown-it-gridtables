import AbstractInsertCommand from "./AbstractInsertCommand";

export default class InsertLineCommand
    extends AbstractInsertCommand
{
    internalExecute()
    {
        // find active column
        const activeCol = this.activeColumn(true);

        // build snippet
        const snippet =
            "$0" +
            this.columnWidths
                .map((w, i) => `| \$\{${((i - activeCol + this.columnWidths.length) % this.columnWidths.length) + 1}:${" ".repeat(w - 3)}\} `)
                .join("") +
            "|" +
            this.eol();

        // determine line
        const line = this
            .position()
            .line +
            (this.insertBelow ?
                1 :
                0);

        this.insertSnippet(
            snippet,
            line);
    }
}