import AbstractCommand from "./AbstractCommand";

export default class InsertTableCommand
    extends AbstractCommand
{
    async execute(): Promise<void>
    {
        // get column count
        const columnsInput = await this
            .showInputBox("Number of columns", "2");

        if (columnsInput === undefined)
        {
            return;
        }

        const columns = parseInt(columnsInput) || 0;

        if (columns < 1)
        {
            this.warning(`Invalid number of columns: ${columnsInput}`);

            return;
        }

        // get row count
        const rowsInput = await this
            .showInputBox("Number of rows", "2");

        if (rowsInput === undefined)
        {
            return;
        }

        const rows = parseInt(rowsInput) || 0;

        if (rows < 1)
        {
            this.warning(`Invalid number of rows: ${rowsInput}`);

            return;
        }

        // build snippet
        const separator =
            "+" +
            "---+".repeat(columns) +
            this.eol();

        let snippet = separator;

        for (let i = 0; i < rows; i++)
        {
            snippet += "| ";

            if (i === 0)
            {
                // add anchor to return to after the placeholders have been looped
                snippet += "$0";
            }

            for (let j = 0; j < columns; j++)
            {
                if (j > 0)
                {
                    snippet += " ";
                }

                snippet += `\${${i * columns + j + 1}: } |`;
            }

            snippet += this.eol();

            // add separator
            snippet += i === 0 ?
                separator.replace(/-/g, "=") : // header separator
                separator;
        }

        // determine line
        const line = this
            .position()
            .line;

        this.insertSnippet(
            snippet,
            line);
    }
}