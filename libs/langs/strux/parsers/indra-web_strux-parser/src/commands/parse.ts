import { StruXParser } from '../parser';
import { Command, ParsedArgs } from './command';
import fs from 'fs';
import { log } from "@meep-tech/utils/build/dev"

export const KEY = 'parse';

export const FLAGS = Object.freeze({
  FILE: Object.freeze({
    SHORT: 'f',
    LONG: 'file',
  }),
  OUTPUT: Object.freeze({
    SHORT: 'o',
    LONG: 'out',
  }),
  HELP: Object.freeze({
    SHORT: 'h',
    LONG: 'help',
  }),
  CODE: Object.freeze({
    SHORT: 'c',
    LONG: 'code',
  }),
  FORMAT: "to"
} as const);

export const ARGS = Object.freeze({
  FILE: Object.freeze({
    FLAGS: Object.freeze([
      FLAGS.FILE.SHORT,
      FLAGS.FILE.LONG,
    ]),
    KEY: 'file',
    HELP: 'Marks the argument as the input file to parse.',
  }),
  OUTPUT: Object.freeze({
    FLAGS: Object.freeze([
      FLAGS.OUTPUT.SHORT,
      FLAGS.OUTPUT.LONG,
    ]),
    KEY: 'out',
    HELP: 'Marks the argument as the output file to write to.',
  }),
  HELP: Object.freeze({
    FLAGS: Object.freeze([
      FLAGS.HELP.SHORT,
      FLAGS.HELP.LONG,
    ]),
    KEY: 'help',
    HELP: 'Prints the help message to the console.',
  }),
  CODE: Object.freeze({
    FLAGS: Object.freeze([
      FLAGS.CODE.SHORT,
      FLAGS.CODE.LONG,
    ]),
    KEY: 'code',
    HELP: 'Marks the argument as the input code to parse.',
  }),
  FORMAT: Object.freeze({
    FLAGS: FLAGS.FORMAT,
    KEY: 'format',
    HELP: 'Marks the argument as the output format to write to.',
  }),
} as const);

export const HELP = `
  Usage: parse [options] [input]

  Description:
    Parses StruX code into an AST.
  Options:
    ${ARGS.FILE.FLAGS.join(', ')}\t${ARGS.FILE.HELP}
    ${ARGS.OUTPUT.FLAGS.join(', ')}\t${ARGS.OUTPUT.HELP}
    ${ARGS.HELP.FLAGS.join(', ')}\t${ARGS.HELP.HELP}
    ${ARGS.CODE.FLAGS.join(', ')}\t${ARGS.CODE.HELP}
    ${ARGS.FORMAT.FLAGS}\t${ARGS.FORMAT.HELP}` as const;

export const COMMAND: Command = {
  KEY,
  ARGS,
  FLAGS,
  HELP,
  EXE: executeParseCommand,
} as const;

export function executeParseCommand(args: ParsedArgs<typeof COMMAND>) {
  if (args.help) {
    log(HELP);
  } else {
    let input: string;
    if (args.file) {
      let file: string;
      if (typeof args.file !== 'string') {
        file = args._.join(" ").trim();
      } else {
        file = args.file;
      }

      input = getInputFromFile(file);
    } else if (args.code) {
      if (typeof args.code !== 'string') {
        input = args._.join(" ").trim();
      } else {
        input = args.code;
      }

      log("Reading input as raw code from args.", { args: args._ }, [[KEY, 'input']]);
    } else {
      input = args._.join(" ").trim();
      if (input.startsWith("./") || input.startsWith("../")) {
        input = getInputFromFile(input);
      } else {
        log("Reading input as raw code from args.", { args: args._ }, [[KEY, 'input']]);
      }
    }

    log("Parsing input code and Generating AST...", { input }, [[KEY, ['AST', 'start']]])
    let tree;
    try {
      tree = StruXParser.static.parse(input);
    } catch (error) {
      log.error("AST generation failed.", { error }, [[KEY, ['AST', 'failed']]])
      process.exit(1);
    }

    if (tree.rootNode.hasError()) {
      log.error("AST generation failed.", { tree, root: tree.rootNode, at: tree.rootNode.startPosition, value: tree.rootNode.text }, [[KEY, ['AST', 'failed']]])
      process.exit(1);
    }

    log("Finished parsing input code and Generating AST.", { tree, root: tree.rootNode }, [[KEY, ['AST', 'success']]])

    let result: string | boolean;
    switch (args.format) {
      default:
      case "sexp":
        log("Converting AST to S-Expression...", { tree }, [[KEY, 'toSexp']])
        result = tree.rootNode.toString();
        break;
      case "json":
        log("Converting AST to JSON", { tree }, [[KEY, 'toJSON']])
        result = JSON.stringify(tree.rootNode, null, 2);
        break;
      case "none":
        result = "Success!";
        break;
      case "bool":
        result = true;
        break;
    }

    if (args.out) {
      let outFile: string;
      if (typeof args.out !== 'string') {
        outFile = "./strux-parser-result.stx.sexp";
      } else {
        outFile = args.out;
      }

      log("Writing result to file.", { outFile, result }, [[KEY, ['output', 'start']]])

      fs.writeFileSync(
        outFile,
        result.toString(),
      );

      log("Finished writing result to file.", { outFile, result }, [[KEY, ['output', 'success']]])
    }

    log("Finished parsing input code and Generating AST.", { result }, [[KEY, ['AST', 'success']]])
  }

  function getInputFromFile(file: string) {
    log("Loading input from file.", file, [[KEY, ['input', ['load-file', 'start']]]]);
    if (!fs.existsSync(file)) {
      log.error("File does not exist.", file, [[KEY, ['input', ['load-file', 'failed']]]]);
      process.exit(1);
    }

    const contents = fs.readFileSync(file, 'utf8');
    log("Finished loading input from file.", { file, contents }, [[KEY, ['input', ['load-file', 'success']]]]);

    return contents;
  }
}

export default COMMAND;