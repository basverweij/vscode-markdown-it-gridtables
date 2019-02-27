import * as vscode from "vscode";
import AbstractGridTableCommand from "./AbstractGridTableCommand";

export default class UpdateContextCommand
    extends AbstractGridTableCommand
{
    protected internalExecute(): void
    {
        this.updateContext(true);
    }

    protected internalNotInGridTable(): void
    {
        this.updateContext(false);
    }

    private updateContext(
        inGridTable: boolean
    ): any
    {
        vscode.commands.executeCommand(
            "setContext",
            "markdownItGridTables:inGridTable",
            inGridTable);
    }
}