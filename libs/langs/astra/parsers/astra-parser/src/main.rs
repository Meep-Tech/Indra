fn main() {
    let args: Vec<String> = std::env::args().collect();

    if args.len() < 2 {
        println!("Usage: parse <file>");
        return;
    }

    let filename = &args[1];
    let source_code = std::fs::read_to_string(filename).unwrap();

    let result = parser::parse(source_code);
    if Err(result) {
        println!("Error: {:?}", result.err());
        return;
    }

    println!("Result: {:?}", result.tree.to_sexp());
}

mod parser {
    fn parse(source_code: String) -> Result<Parser, error::Error> {
        let mut cursor = Cursor {
            pos: 0,
            line: 1,
            col: 1,
            curr: '\0',
            prev: '\0',
            next: '\0',
        };

        let mut parser = Parser { cursor, root: None };

        parser.root = parse_program(&mut parser)?;

        Ok(parser)
    }

    #[derive(Debug)]
    struct Cursor {
        pos: usize,
        line: usize,
        col: usize,

        // the current lookahead char
        curr: char,
        // the previously parsed
        prev: char,
        // the parser actually is always one char ahead
        next: char,
    }

    struct Parser {
        cursor: Cursor,
        root: dyn Node,
    }

    trait Node {
        fn is_error(&self) -> bool;
        fn to_token(&self) -> Result<Token, error::Error>;
    }

    mod error {
        use super::Cursor;

        #[derive(Debug)]
        pub(crate) struct Error {
            pub(crate) at: Cursor,
            pub(crate) msg: String,
        }

        impl std::error::Error for Error {}

        impl std::fmt::Display for Error {
            fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
                write!(
                    f,
                    "!!! ERROR @ LINE:{}, COLUMN: {}, INDEX{}.\n\t{}",
                    self.at.line, self.at.col, self.at.pos, self.msg
                )
            }
        }
    }

    mod token {
        use super::Node;

        struct Builder {
            content: String,
            children: Vec<dyn Node>,
            fields: Vec<String>,
        }
    }
}
