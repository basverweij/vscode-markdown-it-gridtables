import gridTableRulePlugin from "markdown-it-gridtables";

type Plugin = (md: any, options: any) => void;

const Plugins: Plugin[] =
    [
        gridTableRulePlugin,
    ];

export default Plugins;
