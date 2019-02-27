import * as vscode from "vscode";
import Commands from "./commands/Commands";
import Folders from "./folding/Folders";
import Plugins from "./markdown/Plugins";
import RangeFormatters from "./formatting/RangeFormatters";
import UpdateContextCommand from "./commands/UpdateContextCommand";

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
	RangeFormatters.forEach(fmt =>
		context.subscriptions.push(
			vscode.languages.registerDocumentRangeFormattingEditProvider(
				fmt.selector,
				fmt.provider)));

	// register folders
	Folders.forEach(fld =>
		context.subscriptions.push(
			vscode.languages.registerFoldingRangeProvider(
				fld.selector,
				fld.provider)));

	// register update context command
	context.subscriptions.push(
		vscode.window.onDidChangeTextEditorSelection(
			e =>
			{
				const cmd = new UpdateContextCommand(e.textEditor);

				cmd.execute();
			}
		));

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
