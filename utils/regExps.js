export const variableRegex = /(?!{{\s*)[a-z0-9.\-_]+(?=\s*}})/gi;

export const bracketsRegex = /(\s*}})|({{\s*)/gi;

export const specialBracketsRegex = /\s*{{\s*#.+/g;

// TODO: Remove positive lookbehind (fails on Safari)
export const conditionalsRegex =
  /(?<={{\s*#if\s([a-z0-9._]+)\s*}}\s*)(.|\n)+(?=\n?\s*{{\s*#fi\s*}})/gi;

// TODO: Remove positive lookbehind (fails on Safari)
export const loopRegex =
  /(?<={{\s*#for\s(\w+)\sin\s([a-z0-9._]+)\s*}}\s*)(.|\n)+(?=\n?\s*{{\s*#rof\s*}})/gi;

export const commentsRegex = /<!--(.|\n)*-->/gi;