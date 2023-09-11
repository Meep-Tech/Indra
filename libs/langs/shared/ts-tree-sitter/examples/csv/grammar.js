"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entries_1 = require("./tokens/entries");
require("ts-tree-sitter");
const csv = new Grammar({
    name: 'csv',
    rules: [
        entries_1.default
    ]
});
module.exports = csv;
