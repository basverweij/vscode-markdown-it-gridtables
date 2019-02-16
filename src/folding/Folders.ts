import { DocumentSelector, FoldingRangeProvider } from "vscode";
import GridTableFoldingRangeProvider from "./GridTableFoldingRangeProvider.1";
import Languages from "../common/Languages";

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
            Languages.Markdown,
            new GridTableFoldingRangeProvider()),
    ];

export default Folders;
