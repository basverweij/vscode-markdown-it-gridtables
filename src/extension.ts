import * as vscode from "vscode";
import Commands from "./commands/Commands";
import Formatters from "./formatting/Formatters";
import Plugins from "./markdown/Plugins";

export function activate(
	context: vscode.ExtensionContext)
{
	// register commands
	Commands.forEach(cmd =>
		context.subscriptions.push(
			vscode.commands.registerCommand(
				cmd.command,
				cmd.callback)));

	// register formatters
	Formatters.forEach(fmt =>
		context.subscriptions.push(
			vscode.languages.registerDocumentFormattingEditProvider(
				fmt.selector,
				fmt.provider)));

	return {
		extendMarkdownIt(
			md: any)
		{
			// register plugins
			Plugins.forEach(plg =>
			{
				md = md.use(plg);
			});

			return md;
		}
	};
}

export function deactivate() { }
