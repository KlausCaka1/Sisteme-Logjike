import { parseExp } from './parser';
import { toString } from './helpers';
import rules from './simplifyRules';

// Define the main function
export default function simplify(expression = 'BC!BCB+C+!A') {
  // Define action logger
  const output = [];

  // Calculate parsed expression
  let parsed = parseExp(expression);
  console.log('Parsed: ', toString(parsed), parsed);

  // Loop func
  while (true) {
    const simplified = rules.reduce((exp, rule) => rule.apply(exp), parsed);
    console.log('Simplified: ', toString(simplified));

    if (toString(simplified) === toString(parsed)) {
      break;
    }

    parsed = simplified;
  }

  return output;
}
