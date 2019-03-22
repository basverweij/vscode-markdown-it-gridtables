import AbstractInsertCommand from "./AbstractInsertCommand";

export default class InsertSeparatorCommand
    extends AbstractInsertCommand
{
    internalExecute()
    {
        // build snippet
        let snippet =
            "+" +
            this.columnWidths
                .map((w) => "-".repeat(w - 1))
                .join("+") +
            "+" +
            this.eol();

        // get current position
        const pos = this.position();

        // insert placeholder to return to after the snippet has been entered
        // set this to the current character
        snippet =
            snippet.substring(0, pos.character) +
            "$0" +
            snippet.substring(pos.character);

        // determine line
        const line = pos
            .line +
            (this.insertBelow ?
                1 :
                0);

        this.insertSnippet(
            snippet,
            line);
    }
}