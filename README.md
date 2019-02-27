# Visual Studio Code MarkdownIt Grid Tables

[Visual Studio Code](https://code.visualstudio.com/) extension to add support for [Pandoc Grid Tables](https://pandoc.org/MANUAL.html#tables) in the Markdown editor and [MarkdownIt](https://github.com/markdown-it/markdown-it) based preview.

## Key bindings

Key(s)|Command|Description
---|---|---
`Ctrl+T Shift+L`|[InsertLineAbove](src/commands/InsertLineCommand.ts)|
`Ctrl+T L`|[InsertLineBelow](src/commands/InsertLineCommand.ts)|
`Ctrl+T Shift+S`|[InsertSeparatorAbove](src/commands/InsertSeparatorCommand.ts)|
`Ctrl+T S`|[InsertSeparatorBelow](src/commands/InsertSeparatorCommand.ts)|
`Ctrl+T Shift+C`|[InsertColumnLeft](src/commands/InsertColumnCommand.ts)|
`Ctrl+T C`|[InsertColumnRight](src/commands/InsertColumnCommand.ts)|
`Alt+Enter`|[CellNewline](src/commands/CellNewlineCommand.ts)|
`Ctrl+T T`|[InsertTable](src/commands/InsertTableCommand.ts)|
`Ctrl+T H`|[ToggleHeader](src/commands/ToggleHeaderCommand.ts)|
`Ctrl+T Ctrl+L`|[SetColumnAlignmentLeft](src/commands/SetColumnAlignmentCommand.ts)|
`Ctrl+T Ctrl+C`|[SetColumnAlignmentCenter](src/commands/SetColumnAlignmentCommand.ts)|
`Ctrl+T Ctrl+R`|[SetColumnAlignmentRight](src/commands/SetColumnAlignmentCommand.ts)|
`Ctrl+T Ctrl+N`|[SetColumnAlignmentNone](src/commands/SetColumnAlignmentCommand.ts)|
`Shift+Tab`|[CellTabPrevious](src/commands/CellTabCommand.ts)|
`Tab`|[CellTabNext](src/commands/CellTabCommand.ts)|
