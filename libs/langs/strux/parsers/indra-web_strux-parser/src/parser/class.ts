import Parser from 'tree-sitter';
import StruX from 'tree-sitter-strux';
import Config from './config';

export class StruXParser {
  #parser: Parser;

  static readonly static
    = new StruXParser();

  get language(): typeof StruX {
    return this.#parser.getLanguage();
  }

  get logger(): Parser.Logger {
    return this.#parser.getLogger();
  }

  set logger(logFunc: Parser.Logger) {
    this.#parser.setLogger(logFunc);
  }

  constructor() {
    this.#parser = new Parser();
    this.#parser.setLanguage(StruX);
  }

  parse(
    input: string | Parser.Input | Parser.InputReader,
    options?: Config | undefined
  ): Parser.Tree;
  parse(
    updatedInput: string | Parser.Input | Parser.InputReader,
    currentTree?: Parser.Tree | undefined,
    options?: Config | undefined
  ): Parser.Tree;
  parse(...args: any[]): Parser.Tree {
    // args
    if (args.length === 1) {
      return this.#parser.parse(args[0]);
    }

    let input: string | Parser.Input | Parser.InputReader;
    let oldTree: Parser.Tree | undefined;
    let options: Config | undefined;
    if (args[2].hasOwnProperty('rootNode')) {
      input = args[0];
      oldTree = args[1];
      options = args[2];
    } else {
      input = args[0];
      options = args[1];
    }

    // parse
    if (!options?.generateGraphs) { // no options
      return this.#parser.parse(input, oldTree, options);
    } else { // options
      this.#parser.printDotGraphs(true);
      const tree = this.#parser.parse(input, oldTree, options);
      this.#parser.printDotGraphs(false);

      return tree;
    }
  }

  static readonly parse: typeof StruXParser.prototype.parse
    = this.static.parse.bind(this.static);
}

export default StruXParser;