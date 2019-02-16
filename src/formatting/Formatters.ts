import { DocumentSelector, DocumentFormattingEditProvider } from "vscode";
import GridTableDocumentFormattingEditProvider from "./GridTableDocumentFormattingEditProvider";
import Languages from "../common/Languages";

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
