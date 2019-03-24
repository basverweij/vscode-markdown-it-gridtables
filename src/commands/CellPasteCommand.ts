import * as vscode from 'vscode';
import AbstractCellCommand from './AbstractCellCommand';

export default class CellPasteCommand
    extends AbstractCellCommand
{
    internalCellExecute(): void
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