import { DocumentSelector, FoldingRangeProvider } from "vscode";
import GridTableFoldingRangeProvider from "./GridTableFoldingRangeProvider";
import MarkdownDocumentFilter from "../common/MarkdownDocumentFilter";

class FolderRegistration
{
    constructor(
        public selector: DocumentSelector,
        public provider: FoldingRangeProvider)
    { }
}

const Folders: FolderRegistration[] =
    [
        new FolderRegistration(
            MarkdownDocumentFilter,
            new GridTableFoldingRangeProvider()),
    ];

export default Folders;
