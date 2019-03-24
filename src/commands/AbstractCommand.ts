import * as vscode from "vscode";

export default abstract class AbstractCommand
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
    ): Thenable<boolean>
    {
        return this.editor.insertSnippet(
            new vscode.SnippetString(snippet),
            new vscode.Position(line, character || 0));
    }

    protected showInputBox(
        prompt: string,
        value?: string
    ): Thenable<string | undefined>
    {
        return vscode.window.showInputBox(
            { prompt: prompt, value: value }
        );
    }

    protected eol(): string
    {
        return this.editor.document.eol === vscode.EndOfLine.LF ?
            "\n" :
            "\r\n";
    }

    protected newEdit(): EditBuilder
    {
        return new EditBuilder(this.editor);
    }
}

type Edit = (editBuilder: vscode.TextEditorEdit) => void;

export class EditBuilder
{
    private editTxs: Edit[][] = [];

    private edits: Edit[] = [];

    constructor(
        private editor: vscode.TextEditor
    )
    { }

    insert(
        line: number,
        character: number,
        text: string
    ): EditBuilder
    {
        this.edits.push(
            (editBuilder) => editBuilder.insert(
                new vscode.Position(line, character),
                text));

        return this;
    }

    replace(
        line: number,
        start: number,
        end: number,
        text: string
    ): EditBuilder
    {
        this.edits.push(
            (editBuilder) => editBuilder.replace(
                new vscode.Range(
                    new vscode.Position(line, start),
                    new vscode.Position(line, end)),
                text));

        return this;
    }

    perform(): EditBuilder
    {
        this.editTxs.push(this.edits);

        this.edits = [];

        return this;
    }

    complete(): Thenable<boolean>
    {
        this.perform();

        if (this.editTxs.length === 0)
        {
            return Promise.resolve(true);
        }

        let result = this.completeEditTx(
            this.editTxs[0],
            true,
            this.editTxs.length === 1);

        for (let i = 1; i < this.editTxs.length; i++)
        {
            result = result
                .then(() => this.completeEditTx(
                    this.editTxs[i],
                    false,
                    i === this.editTxs.length - 1));
        }

        return result;
    }

    private completeEditTx(
        edits: Edit[],
        markBefore: boolean,
        markAfter: boolean
    ): Thenable<boolean>
    {
        return this.editor.edit(
            (editBuilder) => edits.forEach(
                e => e(editBuilder)),
            {
                undoStopBefore: markBefore,
                undoStopAfter: markAfter,
            });
    }
}
