import * as vscode from "vscode";
import AbstractInsertCommand from "./AbstractInsertCommand";
import getTableStartLine from "../gridtables/GetTableStartLine";
import nthIndexOf from "../common/NthIndexOf";

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
        let nthIndex = this.activeColumn();

        // make sure that the index is set to a valid column
        if (nthIndex < 0)
        {
            nthIndex = 0;
        }
        else if (nthIndex >= this.columnWidths.length)
        {
            nthIndex = this.columnWidths.length - 1;
        }

        // determine where to insert
        nthIndex += (this.insertBelow ? 2 : 1);

        const doc = this.editor.document;

        const startLine = getTableStartLine(
            doc,
            this.position());

        if (startLine === -1)
        {
            return;
        }

        const inserts: Insert[] = [];

        let insert: string;

        // loop all table lines
        for (let i = startLine; i < doc.lineCount; i++)
        {
            const line = doc
                .lineAt(i)
                .text;

            if (line.startsWith("+"))
            {
                insert = line.indexOf("-") >= 0 ?
                    "+---" :
                    "+===";
            }
            else if (line.startsWith("|"))
            {
                insert = "|   ";
            }
            else
            {
                // no longer in the table
                break;
            }

            // find location to insert and add to table
            const c = nthIndexOf(
                line,
                insert.charAt(0),
                nthIndex);

            if (c >= 0)
            {
                inserts.push(
                    new Insert(i, c, insert));
            }
        }

        if (inserts.length > 0)
        {
            // perform the inserts
            this.editor.edit(
                (editBuilder: vscode.TextEditorEdit) => 
                {
                    inserts.forEach(i =>
                        editBuilder.insert(
                            new vscode.Position(i.line, i.character),
                            i.value));
                }
            );
        }
    }
}

class Insert
{
    constructor(
        public line: number,
        public character: number,
        public value: string,
    )
    { }
}
