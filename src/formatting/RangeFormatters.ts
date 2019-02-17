import { DocumentSelector, DocumentRangeFormattingEditProvider } from "vscode";
import GridTableDocumentRangeFormattingEditProvider from "./GridTableDocumentRangeFormattingEditProvider";
import MarkdownDocumentFilter from "../common/MarkdownDocumentFilter";

class RangeFormatterRegistration
{
    constructor(
        public selector: DocumentSelector,
        public provider: DocumentRangeFormattingEditProvider)
    { }
}

const RangeFormatters: RangeFormatterRegistration[] =
    [
        new RangeFormatterRegistration(
            MarkdownDocumentFilter,
            new GridTableDocumentRangeFormattingEditProvider()),
    ];

export default RangeFormatters;
