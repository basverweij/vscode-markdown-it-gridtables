import { Position } from "vscode";

/**
 * IDocument defines an abstraction to a text document.
 */
export interface IDocument
{
    /**
     * GetCursorPosition returns the position of the cursor in the document.
     */
    cursorPosition(): Position;

    /**
     * GetLineAt returns the text of a line in the document.
     * 
     * @param number The line number (zero-based).
     */
    lineAt(number: number): string;
}