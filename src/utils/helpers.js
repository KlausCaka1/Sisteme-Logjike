export function intersection(arr1, arr2) {
  return arr1.filter(value => arr2.indexOf(value) !== -1);
}

export const toString = parsedExp =>
  parsedExp
    .map(group =>
      group.inner
        ? `${toString(group.prefix)}(${toString(group.inner)})${toString(group.suffix)}`
        : group.vars.join('')
    )
    .join('+');

export const closingParanthesisIndex = str => {
  let cursor = 0;
  let depth = 1;

  while (depth > 0) {
    const match = str.substring(cursor).match(/\)|\(/);

    if (match[0] === '(') {
      depth++;
    } else if (match[0] === ')') {
      depth--;
    }

    cursor += match.index + 1;
  }

  return cursor;
};
