import AbstractInsertCommand from "./AbstractInsertCommand";

export default class InsertSeparatorCommand
    extends AbstractInsertCommand
{
    internalExecute()
    {
        // build snippet
        const snippet =
            "+" +
            this.columnWidths
                .map((w) => "-".repeat(w - 1))
                .join("+") +
            "+" +
            this.eol() +
            "$0";

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