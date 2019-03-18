import * as vscode from "vscode";
import Commands from "./commands/Commands";
import Folders from "./folding/Folders";
import Plugins from "./markdown/Plugins";
import RangeFormatters from "./formatting/RangeFormatters";
import updateInGridTableContext from "./context/UpdateInGridTableContext";

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

	// register update context handler
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(
			e => e && updateInGridTableContext(e)));

	context.subscriptions.push(
		vscode.window.onDidChangeTextEditorSelection(
			e => updateInGridTableContext(e.textEditor)));

	if (vscode.window.activeTextEditor)
	{
		// set initial context
		updateInGridTableContext(vscode.window.activeTextEditor);
	}

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
