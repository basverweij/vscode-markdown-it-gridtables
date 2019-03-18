import AbstractInsertCommand from "./AbstractInsertCommand";
import getTableStartLine from "../gridtables/GetTableStartLine";
import nthIndexOf from "../common/NthIndexOf";
import { Insert } from "./AbstractCommand";

/**
 * The Insert Column Command inserts a new column into the
 * active grid table. It uses the `insertBelow` property from
 * its super class to determine where the column must be inserted:
 * 
 * * `insertBelow=false`: insert column left
 * * `insertBelow=true`: insert column right
 */
export default class InsertColumnCommand
    extends AbstractInsertCommand
{
    protected internalExecute(): void
    {
        const nthIndex = this
            .activeColumn(true) +
            (this.insertBelow ?
                2 :
                1);

        const doc = this.editor.document;

        const startLine = getTableStartLine(
            doc,
            this.position());

        if (startLine === -1)
        {
            return;
        }

        const inserts: Insert[] = [];

        let text: string;

        // loop all table lines
        for (let i = startLine; i < doc.lineCount; i++)
        {
            const line = doc
                .lineAt(i)
                .text;

            if (line.startsWith("+"))
            {
                text = line.indexOf("-") >= 0 ?
                    "+---" :
                    "+===";
            }
            else if (line.startsWith("|"))
            {
                text = "|   ";
            }
            else
            {
                // no longer in the table
                break;
            }

            // find location to insert and add to table
            const c = nthIndexOf(
                line,
                text.charAt(0),
                nthIndex);

            if (c >= 0)
            {
                inserts.push(
                    new Insert(i, c, text));
            }
        }

        if (inserts.length > 0)
        {
            this.makeInserts(...inserts);
        }
    }
}
