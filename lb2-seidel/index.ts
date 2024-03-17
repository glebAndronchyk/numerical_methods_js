import {epsilon, MAX_DISCREPANCY, INITIAL_COEFS, INITIAL_ITERATION_STATE, A, B} from "./settings";
import {Equation, Matrix} from "./types";
import {getEquations, getNormalizedMatrix} from "./helpers";

const iterate = (equations: Equation[], coefficients , state = {...INITIAL_ITERATION_STATE}): number[] | null => {

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

export const seidelClarify = (mA: Matrix, mB: Matrix) => {
  const equations = getEquations(mA, mB);
  const coefficients = Array.from({length: mA[0].length}).fill(1) as number[];

  const firstIteration = iterate(equations, coefficients);

  if (!firstIteration) {
    // matrix diverged
    const {normalizedA, normalizedB} = getNormalizedMatrix(mA, mB);
    const normalizedEquations = getEquations(normalizedA, normalizedB)

    return iterate(normalizedEquations, coefficients);
  }

  return firstIteration;
}

console.log(seidelClarify(A, B).reduce((acc, x, i) => ({
  ...acc,
  [`x${i + 1}`]: x,
}), {}));
