import * as vscode from 'vscode';
import AbstractCommand from "./AbstractCommand";

export default class CellPasteCommand
    extends AbstractCommand
{
    execute()
    {
        const pos = this.position();

        vscode.env.clipboard.readText().then((text) =>
        {
            this.newEdit()
                .insert(pos.line, pos.character, text)
                .complete();
        });
    }
}