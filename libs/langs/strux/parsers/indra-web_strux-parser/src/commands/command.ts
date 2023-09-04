import { argv } from "process";

export type Key = string;

export type Flag = string | {
  SHORT: string;
  LONG: string;
}

export type Arg = {
  FLAGS: Flag,
  KEY: Key,
  HELP: string,
}

export type Command<
  TArgs extends Record<Key, Arg> = any
> = {
  KEY: Key,
  ARGS: TArgs,
  FLAGS: Record<Key, TArgs[Key]['FLAGS']>,
  HELP: string,
  EXE: (args: ParsedArgs<Command<TArgs>>) => void,
}

export function isCommand(command: Key | Command): boolean {
  const key = (typeof command === 'string') ? command : command.KEY;

  return argv[2] === key;
}

export function getFlags<TCommand extends Command>(command: TCommand): TCommand['FLAGS'][keyof TCommand['FLAGS']][] {
  return Object.values(command.FLAGS).map(
    flag => typeof flag === 'string'
      ? [flag]
      : [flag.SHORT, flag.LONG]
  ).flat();
}

export function getArg(command: Command, flag: Flag): string {
  return Object.keys(command.ARGS).find(key => {
    const arg = command.ARGS[key];
    return typeof arg.FLAGS === 'string'
      ? arg.FLAGS === flag
      : arg.FLAGS.SHORT === flag || arg.FLAGS.LONG === flag;
  })?.toLowerCase()!;
}

export type ParsedArgs<TCommand extends Command> = Record<TCommand['ARGS'][keyof TCommand['ARGS']]['KEY'], string | boolean> & {
  count: number;
  _: string[];
};

export function parseArgs<
  TCommand extends Command
>(command: TCommand): ParsedArgs<TCommand> {
  const parsedArgs: ParsedArgs<TCommand> = { count: 0, _: [] } as ParsedArgs<TCommand>;

  if (argv.length === 3) {
    return parsedArgs;
  } else {
    const args = argv.slice(3);
    while (args.length) {
      // single dash expects a lone boolean flag
      if (args[0].startsWith("-")) {
        // double dash expects a value
        if (args[0].startsWith("--")) {
          let arg = args.shift()!.slice(2);
          // check which arg it is using startswith:
          let key: TCommand['ARGS'][keyof TCommand['ARGS']]['KEY'] | undefined;
          for (const flag of getFlags(command)) {
            if (arg.startsWith(flag)) {
              arg = arg.slice(flag.length);
              key = getArg(command, flag);
              break;
            }
          }

          if (key) {
            if (arg.startsWith("=")) {
              parsedArgs[key] = arg.slice(1);
            } else {
              parsedArgs[key] = args.shift()!;
            }

            parsedArgs.count += 1;
            continue;
          } else {
            throw new Error(`Unknown flag: ${arg}`);
          }

        } // - (single)
        else {
          const flag = args.shift()!.slice(1) as TCommand['FLAGS'][keyof TCommand['FLAGS']];

          if (getFlags(command).includes(flag)) {
            parsedArgs[flag] = true as any;
            parsedArgs.count += 1;
            continue;
          } else {
            throw new Error(`Unknown flag: ${flag}`);
          }
        }
      } // else, it's a naked arg
      else {
        parsedArgs._ = [];
        parsedArgs._.push(args.shift()!);
      }
    }

    return parsedArgs;
  }
}