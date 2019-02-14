import * as vscode from "vscode";
import { GridTableRulePlugin } from "markdown-it-gridtables";
import { insertLineBelowCommand, Commands, insertLineAboveCommand, insertSeparatorAbove, insertSeparatorBelow } from "./commands";

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand(
			Commands.InsertLineAbove,
			insertLineAboveCommand));

	context.subscriptions.push(
		vscode.commands.registerCommand(
			Commands.InsertLineBelow,
			insertLineBelowCommand));

	context.subscriptions.push(
		vscode.commands.registerCommand(
			Commands.InsertSeparatorAbove,
			insertSeparatorAbove));

	context.subscriptions.push(
		vscode.commands.registerCommand(
			Commands.InsertSeparatorBelow,
			insertSeparatorBelow));

	return {
		extendMarkdownIt(md: any) {
			return md.use(GridTableRulePlugin);
		}
	};
}

export function deactivate() { }
