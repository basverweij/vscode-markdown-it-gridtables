import AbstractInsertCommand from "./AbstractInsertCommand";

export default class InsertLineCommand
    extends AbstractInsertCommand
{
    internalExecute()
    {
        // find active column
        const activeCol = this.activeColumn(true);

        // build snippet
        let snippet =
            this.columnWidths
                .map((w, i) => `| \$\{${((i - activeCol + this.columnWidths.length) % this.columnWidths.length) + 1}:${" ".repeat(w - 3)}\} `)
                .join("") +
            "|" +
            this.eol();

        // insert placeholder to return to after the snippet has been entered
        // set this to the start of the active column (before the $1 placeholder)
        snippet = snippet.replace("${1:", "$0${1:");

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