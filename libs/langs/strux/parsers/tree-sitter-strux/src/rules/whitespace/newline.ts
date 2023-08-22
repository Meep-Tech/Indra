export const nl
  = /(\r\n|\r|\n|\n\r)/;

export const nls
  = new RegExp(`${nl}*`);

export const nl_s
  = new RegExp(`${nl}+`);

export default nl;
export {
  nl as newline,
  nls as newlines,
  nl_s as newline_s
}