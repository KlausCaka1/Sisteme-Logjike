import { parseExp } from './parser';
import { toString } from './helpers';
import { applyRules } from './rules';

// Define the main function
export default function simplify(expression = 'B+(!X+A(Y+C))') {
  // Calculate parsed expression
  console.log('INITIAL: ', expression);
  const parsed = parseExp(expression);
  console.log('Parsed: ', toString(parsed), parsed);

  // Define action logger
  const logger = [toString(parsed)];

  // Loop func
  let prevSimplified = parsed;

  while (true) {
    const simplified = applyRules(prevSimplified);
    console.log('Simplified: ', toString(simplified), simplified);

    if (toString(simplified) === toString(prevSimplified)) {
      break;
    }

    logger.push(toString(simplified));

    prevSimplified = simplified;
  }

  return toString(prevSimplified);
}
