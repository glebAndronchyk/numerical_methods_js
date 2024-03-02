import {epsilon, MAX_DISCREPANCY, INITIAL_COEFS, INITIAL_ITERATION_STATE, A, B} from "./settings";
import {Equation} from "./types";
import {getEquations, getNormalizedMatrix} from "./helpers";

const iterate = (equations: Equation[], coefficients = INITIAL_COEFS, state = {...INITIAL_ITERATION_STATE}): number[] | null => {

  let accuracyCount = 0;

  equations.forEach((eq, index) => {
    const coefsCopy =  [...coefficients];
    coefsCopy[index] = null; // resets current coef in order to prevent it from taking part in calculations

    // Current X is being calculated
    const result = eq(...coefsCopy);
    // This is used in comparison with epsilon
    const absoluteDifference = Math.abs(coefficients[index] - result);
    const prevAbsoluteDifference = state.prevAbsoluteDifferences[index];
    const isDifferencesNormal = !prevAbsoluteDifference || (prevAbsoluteDifference > absoluteDifference);

    if (absoluteDifference <= epsilon) {
      accuracyCount++;
    } else if (!isDifferencesNormal) {
      // Matrix starts to diverge
      state.totalDiscrepancy++;
    }

    // remembering current absolute difference
    state.prevAbsoluteDifferences[index] = absoluteDifference;
    coefficients[index] = result;
  });

  // when matrix diverged => I should normalize it
  if (state.totalDiscrepancy >= MAX_DISCREPANCY) {
    return null;
  }

  // clarification ended
  if (accuracyCount === equations.length) {
    return coefficients;
  }

  return iterate(equations, coefficients, state);
}

const clarify = () => {
  const equations = getEquations(A, B);

  const firstIteration = iterate(equations);

  if (!firstIteration) {
    // matrix diverged
    const {normalizedA, normalizedB} = getNormalizedMatrix(A, B);
    const normalizedEquations = getEquations(normalizedA, normalizedB)

    return iterate(normalizedEquations);
  }

  return firstIteration;
}

console.log(clarify());
