import { DocumentSelector, DocumentFormattingEditProvider } from "vscode";
import GridTableDocumentFormattingEditProvider from "./GridTableDocumentFormattingEditProvider";

enum Languages
{
    Markdown = "markdown",
}

class FormatterRegistration
{
    constructor(
        public selector: DocumentSelector,
        public provider: DocumentFormattingEditProvider)
    { }
}

const Formatters: FormatterRegistration[] =
    [
        new FormatterRegistration(
            Languages.Markdown,
            new GridTableDocumentFormattingEditProvider()),
    ];

export default Formatters;
