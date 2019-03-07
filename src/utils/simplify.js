import { parseExp } from './parser';
import { toString } from './helpers';
import { applyRules } from './rules';

// Define the main function
export default function simplify(expression = 'B+(!X+A(Y+C))') {
  // Calculate parsed expression
  console.log('INITIAL: ', expression);
  const parsed = parseExp(expression);
  console.log('PARSED: ', toString(parsed), parsed);

  const output = [];

  // Loop func
  let prevSimplified = parsed;

  while (true) {
    const simplified = applyRules(prevSimplified, output);
    console.log('Simplified: ', toString(simplified), simplified);

    if (toString(simplified) === toString(prevSimplified)) {
      break;
    }

    prevSimplified = simplified;
  }

  console.log('OUTPUT: ', output);

  return toString(prevSimplified);
}
