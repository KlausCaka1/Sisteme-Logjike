import { closingParanthesisIndex } from './helpers';

const formatVars = varStr => {
  if (varStr.includes('(')) {
    const startIndex = varStr.indexOf('(');
    const lastIndex = startIndex + closingParanthesisIndex(varStr.substring(startIndex + 1));

    return {
      vars: [],
      prefix: parseExp(varStr.substring(0, startIndex)),
      inner: parseExp(varStr.substring(startIndex + 1, lastIndex)),
      suffix: parseExp(varStr.substring(lastIndex + 1))
    };
  }

  const vars = varStr.split('').reduce((acc, curr) => {
    // handle '!'
    const prev = acc[acc.length - 1];
    if (prev && prev[prev.length - 1] === '!') {
      const accCopy = [...acc];
      accCopy[acc.length - 1] += curr;

      return accCopy;
    }

    return [...acc, curr];
  }, []);

  return { vars };
};

export const parseExp = exp => {
  const termsSplit = [];
  let cursorPos = 0;

  while (cursorPos < exp.length) {
    const match = exp.substring(cursorPos).match(/\+|\(/);

    // handle last expression group
    if (!match) {
      termsSplit.push(formatVars(exp.substring(cursorPos)));
      break;
    }

    // handle '+' split
    if (match[0] === '+') {
      const matchStr = exp.substring(cursorPos, cursorPos + match.index);

      termsSplit.push(formatVars(matchStr));

      cursorPos += matchStr.length + 1;
    }

    if (match[0] === '(') {
      let tmpCursorPos = cursorPos + match.index;

      while (true) {
        const nextMatch = exp.substring(tmpCursorPos).match(/\(|\+/);

        if (!nextMatch) {
          tmpCursorPos = exp.length;
          break;
        }

        if (nextMatch[0] === '(') {
          tmpCursorPos +=
            closingParanthesisIndex(exp.substring(tmpCursorPos + nextMatch.index + 1)) + 1;
        }

        if (nextMatch[0] === '+') {
          tmpCursorPos += nextMatch.index + 1;
          break;
        }
      }

      const matchStr = exp.substring(cursorPos, tmpCursorPos);

      termsSplit.push(formatVars(matchStr));
      cursorPos += matchStr.length + 1;
    }
  }

  return termsSplit;
};
