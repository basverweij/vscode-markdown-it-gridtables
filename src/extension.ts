import * as vscode from "vscode";
import { GridTableRulePlugin } from "markdown-it-gridtables";
import Commands from "./commands/Commands";
import { GridTableDocumentFormattingEditProvider } from "./formatting/GridTableDocumentFormattingEditProvider";

export function activate(
	context: vscode.ExtensionContext)
{
	// register commands
	Commands.forEach(cmd =>
		context.subscriptions.push(
			vscode.commands.registerCommand(
				cmd.command,
				cmd.callback)));

	// add formatting support
	context.subscriptions.push(
		vscode.languages.registerDocumentFormattingEditProvider(
			"markdown",
			new GridTableDocumentFormattingEditProvider()));

	return {
		extendMarkdownIt(
			md: any)
		{
			return md.use(GridTableRulePlugin);
		}
	};
}

export function deactivate() { }
