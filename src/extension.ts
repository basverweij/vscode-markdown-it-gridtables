import * as vscode from "vscode";
import * as markdownItGridTables from "markdown-it-gridtables";

export function activate(context: vscode.ExtensionContext) {

	return {
		extendMarkdownIt(md: any) {
			return md.use(markdownItGridTables);
		}
	};
}

export function deactivate() { }
