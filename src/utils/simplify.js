import { parseExp } from './parser';
import { toString } from './helpers';
import rules from './simplifyRules';

// Define the main function
export default function simplify(expression = 'BC+A(B+CA)(A+B)') {
  // Define action logger
  const output = [];

  // Calculate parsed expression
  console.log('INITIAL: ', expression);
  let parsed = parseExp(expression);
  console.log('Parsed: ', toString(parsed), parsed);

  // Loop func
  while (true) {
    const simplified = rules.reduce((exp, rule) => rule.apply(exp), parsed);
    console.log('Simplified: ', toString(simplified), simplified);

    if (toString(simplified) === toString(parsed)) {
      break;
    }

    parsed = simplified;
  }

  return output;
}
