import { parseExp } from './parser';
import { toString } from './helpers';
import { applyRules } from './rules';

// Define the main function
export default function simplify(expression = 'BC+!(A+(BB))') {
  // Define action logger
  const logger = [];

  // Calculate parsed expression
  console.log('INITIAL: ', expression);
  let parsed = parseExp(expression);
  console.log('Parsed: ', toString(parsed), parsed);

  // Loop func
  while (true) {
    const simplified = applyRules(parsed);
    console.log('Simplified: ', toString(simplified), simplified);

    if (toString(simplified) === toString(parsed)) {
      break;
    }

    parsed = simplified;
  }

  return logger;
}
