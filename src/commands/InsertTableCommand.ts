import AbstractCommand from "./AbstractCommand";

export default class InsertTableCommand
    extends AbstractCommand
{
    execute(): void
    {
        // build snippet
        const snippet =
            "+---+---+\n" +
            "| $0${1: } | ${2: } |\n" +
            "+===+===+\n" +
            "| ${3: } | ${4: } |\n" +
            "+---+---+\n";

        // determine line
        const line = this
            .position()
            .line;

        this.insertSnippet(
            snippet,
            line);
    }
}