export const nbwsp
  = /[ \t]/;

export const nbwsps
  = new RegExp(`${nbwsp}*`);

export const nbwsp_s
  = new RegExp(`${nbwsp}+`);

export default nbwsp;
export {
  nbwsp as nonBreakingWhitespace,
  nbwsps as nonBreakingWhitespaces,
  nbwsp_s as nonBreakingWhitespace_s
}