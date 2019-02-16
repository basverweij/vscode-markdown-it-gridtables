import * as vscode from "vscode";
import AbstractGridTableCommand from "./AbstractGridTableCommand";

export default abstract class AbstractInsertCommand
    extends AbstractGridTableCommand
{
    constructor(
        editor: vscode.TextEditor,
        protected readonly insertBelow: boolean)
    {
        super(editor);
    }
}