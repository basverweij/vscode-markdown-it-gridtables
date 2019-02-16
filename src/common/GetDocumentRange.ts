import * as vscode from "vscode";

export default function getDocumentRange(
    document: vscode.TextDocument):
    vscode.Range
{
    return new vscode.Range(
        new vscode.Position(0, 0),
        new vscode.Position(document.lineCount - 1, 0));
}
