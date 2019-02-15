import { GridTableRulePlugin } from "markdown-it-gridtables";

type Plugin = (md: any, options: any) => void;

const Plugins: Plugin[] =
    [
        GridTableRulePlugin,
    ];

export default Plugins;
