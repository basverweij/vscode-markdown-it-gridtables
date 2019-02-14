import * as vscode from "vscode";
import { IDocument } from "../interfaces/IDocument";

export class DocumentAdapter
    implements IDocument {

    constructor(private textEditor: vscode.TextEditor) {

    }

    cursorPosition(): vscode.Position {
        return this.textEditor
            .selection
            .active;
    }

    lineAt(number: number): string {
        return this.textEditor
            .document
            .lineAt(number)
            .text;
    }
}