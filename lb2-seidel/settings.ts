export const INITIAL_MATRIX = [[4,1,2, 3],[5,2.2,1.5, 11],[12,3.8,14, 5]];
export const {A, B} = INITIAL_MATRIX.reduce<{A: number[][], B: number[][]}>((acc, row) => {
  const last = row.length - 1

  const aData = row.slice(0, last);
  const bData = [row[last]];

  return {
    A: [...acc.A, aData],
    B: [...acc.B, bData],
  }
}, {A: [], B:[]});

export const FIRST_ITERATION_COEFFICIENTS = [1,1,1];
// THIS SHOULD BE CALCULATED IN RUNTIME
export const MAX_D = 100;

export const epsilon = 0.01;
