import { DocumentSelector, DocumentRangeFormattingEditProvider } from "vscode";
import Languages from "../common/Languages";
import GridTableDocumentRangeFormattingEditProvider from "./GridTableDocumentRangeFormattingEditProvider";

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
            Languages.Markdown,
            new GridTableDocumentRangeFormattingEditProvider()),
    ];

export default RangeFormatters;
