import { DocumentSelector, DocumentFormattingEditProvider } from "vscode";
import GridTableDocumentFormattingEditProvider from "./GridTableDocumentFormattingEditProvider";
import MarkdownDocumentFilter from "../common/MarkdownDocumentFilter";

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
            MarkdownDocumentFilter,
            new GridTableDocumentFormattingEditProvider()),
    ];

export default Formatters;
