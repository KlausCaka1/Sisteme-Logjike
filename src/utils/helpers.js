export function intersection(arr1, arr2) {
  return arr1.filter(value => arr2.indexOf(value) !== -1);
}

export const toString = parsedExp => parsedExp.map(el => el.vars.join('')).join('+');
