import Parser from 'tree-sitter';

export type ParseConfig = {
  bufferSize?: number | undefined;
  includedRanges?: Parser.Range[] | undefined;
  generateGraphs?: boolean | undefined;
};

export default ParseConfig;