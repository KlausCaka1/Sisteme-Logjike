const formatVars = varStr => varStr.split('').reduce((acc, curr) => {
    // handle '!'
    if (acc[acc.length - 1] === '!') {
      const accCopy = [...acc];
      accCopy[acc.length - 1] += curr;

      return accCopy;
    }

    return [...acc, curr];
  }, []);

export const parseExp = exp => {
  const termsSplit = [];
  let cursorPos = 0;

  while (cursorPos < exp.length) {
    const match = exp.substr(cursorPos).match(/\+|\(/);

    // handle last expression group
    if (!match) {
      termsSplit.push({
        vars: formatVars(exp.substr(cursorPos, exp.length - 1))
      });

      break;
    }

    // handle '+' split
    if (match[0] === '+') {
      const matchStr = exp.substr(cursorPos, match.index);

      termsSplit.push({
        vars: formatVars(matchStr)
      });

      cursorPos += matchStr.length + 1;
    }
  }

  return termsSplit;
};

