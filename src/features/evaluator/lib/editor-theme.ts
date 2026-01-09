import { EditorView } from "@codemirror/view"
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language"
import { tags as t } from "@lezer/highlight"

// Tokyo Night inspired colors
const colors = {
    background: "#1a1b26",
    foreground: "#a9b1d6",
    selection: "#515c7e40",
    selectionMatch: "#16161e",
    cursor: "#c0caf5",
    dropdownBackground: "#1f2335",
    dropdownBorder: "#1f2335",
    activeLine: "#292e42",
    matchingBracket: "#3b4261",
    keyword: "#bb9af7",
    storage: "#bb9af7",
    variable: "#c0caf5",
    parameter: "#e0af68",
    function: "#7aa2f7",
    string: "#9ece6a",
    constant: "#ff9e64",
    type: "#2ac3de",
    class: "#7dcfff",
    number: "#ff9e64",
    comment: "#565f89",
    heading: "#89ddff",
    invalid: "#f7768e",
    regexp: "#b4f9f8",
    tag: "#f7768e",
    attribute: "#bb9af7",
}

export const tokyoNightTheme = EditorView.theme({
    "&": {
        color: colors.foreground,
        backgroundColor: colors.background,
    },
    ".cm-content": {
        caretColor: colors.cursor,
        fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
    },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: colors.cursor },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
        { backgroundColor: "#3b82f660" },
    ".cm-panels": { backgroundColor: colors.dropdownBackground, color: colors.foreground },
    ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
    ".cm-searchMatch": {
        backgroundColor: "#72a1ff59",
        outline: "1px solid #457dff",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
        backgroundColor: "#6199ff2f",
    },
    ".cm-activeLine": { backgroundColor: colors.activeLine },
    ".cm-selectionMatch": { backgroundColor: colors.selectionMatch },
    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
        backgroundColor: colors.matchingBracket,
        outline: "1px solid #515c7e",
    },
    ".cm-gutters": {
        backgroundColor: colors.background,
        color: colors.comment,
        border: "none",
    },
    ".cm-activeLineGutter": {
        backgroundColor: colors.activeLine,
        color: colors.foreground,
    },
    ".cm-foldPlaceholder": {
        backgroundColor: "transparent",
        border: "none",
        color: "#ddd",
    },
    ".cm-tooltip": {
        border: `1px solid ${colors.dropdownBorder}`,
        backgroundColor: colors.dropdownBackground,
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
    },
    ".cm-tooltip .cm-tooltip-arrow:after": {
        borderTopColor: colors.foreground,
        borderBottomColor: colors.foreground,
    },
    ".cm-tooltip-autocomplete": {
        "& > ul > li[aria-selected]": {
            backgroundColor: colors.selection,
            color: colors.foreground,
        },
    },
})

export const tokyoNightHighlightStyle = HighlightStyle.define([
    { tag: t.keyword, color: colors.keyword },
    { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: colors.variable },
    { tag: [t.processingInstruction, t.string, t.inserted], color: colors.string },
    { tag: [t.function(t.variableName), t.labelName], color: colors.function },
    { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: colors.constant },
    { tag: [t.definition(t.name), t.separator], color: colors.variable },
    { tag: [t.className], color: colors.class },
    { tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: colors.number },
    { tag: [t.typeName, t.bool, t.null], color: colors.type },
    { tag: t.operator, color: colors.keyword },
    { tag: [t.url, t.escape, t.regexp, t.link], color: colors.regexp },
    { tag: [t.meta, t.comment], color: colors.comment },
    { tag: t.strong, fontWeight: "bold" },
    { tag: t.emphasis, fontStyle: "italic" },
    { tag: t.strikethrough, textDecoration: "line-through" },
    { tag: t.link, color: colors.comment, textDecoration: "underline" },
    { tag: t.heading, fontWeight: "bold", color: colors.heading },
    { tag: [t.atom, t.bool, t.special(t.variableName)], color: colors.constant },
    { tag: [t.processingInstruction, t.string, t.inserted], color: colors.string },
    { tag: t.invalid, color: colors.invalid },
    { tag: t.tagName, color: colors.tag },
    { tag: t.attributeName, color: colors.attribute },
])

export const tokyoNight = [tokyoNightTheme, syntaxHighlighting(tokyoNightHighlightStyle)]
