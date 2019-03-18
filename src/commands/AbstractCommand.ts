import * as vscode from "vscode";

export default class AbstractCommand
{
    constructor(
        protected readonly editor: vscode.TextEditor)
    { }

    execute(): void { }

    protected warning(
        message: string
    )
    {
        vscode.window.showWarningMessage(message);
    }

    protected position(): vscode.Position
    {
        return this.editor
            .selection
            .active;
    }

    protected select(
        line: number,
        character: number,
        width: number = 0)
    {
        // start at the end, so that the cursor is positioned correctly
        const from = new vscode.Position(
            line,
            character + width);

        const to = new vscode.Position(
            line,
            character);

        this.editor.selection = new vscode.Selection(from, to);

        this.editor.revealRange(
            this.editor.selection,
            vscode.TextEditorRevealType.Default);
    }

    protected insertSnippet(
        snippet: string,
        line: number,
        character?: number
    ): PromiseLike<boolean>
    {
        return this.editor.insertSnippet(
            new vscode.SnippetString(snippet),
            new vscode.Position(line, character || 0));
    }

    protected makeReplacements(
        ...replacements: Replacement[]
    ): PromiseLike<boolean>
    {
        if (replacements.length === 0)
        {
            return Promise.resolve(true);
        }

        return this.editor.edit((
            editBuilder: vscode.TextEditorEdit
        ) =>
        {
            replacements.forEach(r =>
                editBuilder.replace(
                    new vscode.Range(
                        new vscode.Position(r.line, r.start),
                        new vscode.Position(r.line, r.end)),
                    r.text));
        });
    }

    protected makeInserts(
        ...inserts: Insert[]
    ): PromiseLike<boolean>
    {
        if (inserts.length === 0)
        {
            return Promise.resolve(true);
        }

        return this.editor.edit((
            editBuilder: vscode.TextEditorEdit
        ) => 
        {
            inserts.forEach(i =>
                editBuilder.insert(
                    new vscode.Position(i.line, i.character),
                    i.text));
        });
    }
}

export class Replacement
{
    constructor(
        readonly line: number,
        readonly start: number,
        readonly end: number,
        readonly text: string
    )
    { }
}

export class Insert
{
    constructor(
        readonly line: number,
        readonly character: number,
        readonly text: string
    )
    { }
}
