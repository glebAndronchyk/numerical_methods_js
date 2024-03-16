
type FnType = (x:number, y:number) => number;

class Equation {
  constructor(private fn: FnType,
              private equals: number) {
  }

  toLeftSide(): FnType {
    return (x: number, y: number) => this.fn(x, y) - this.equals;
  }

  intersects(eq: Equation): [number, number] {
    return [0, 0];
  }

  getDerivativeByPoint(x, y, d = 0.1) {
    const fn = this.toLeftSide();
    const dfx = (fn(x + d, y) - fn(x, y)) / d;
    const dfy = (fn(x, y + d) - fn(x, y)) / d;

    return { dfx, dfy };
  }
}

class SONE {

  constructor(private equations: Equation[]) {}

  solve = () => {
    // const [x, y] = this.eq1.intersects(this.eq2);
    const [x, y] = [0,0];

    const [clarifiedX, clarifiedY] = this._clarifyStartValues(x, y);
  };

  _clarifyStartValues(x: number, y: number) {
    // LOOP maybe???
    const derivation = this._createDerivativeMatrix(x, y);
    if (!this._checkIntermediateResult(derivation)) {
      //add step
      return this._clarifyStartValues(x, y);
    }

    return [x, y];
    // return [x, y, derivation]; ???????????? derivation === J
  };
  _createDerivativeMatrix = (x, y) => {
    return this.equations.map((eq) => {
      const { dfx, dfy} = eq.getDerivativeByPoint(x, y);

      return [dfx, dfy];
    })
  };
  _checkIntermediateResult = (derivation: number[][], accuracy = 5) => {
    return derivation.reduce((acc,  [dfx, dfy]) => {
      if (Math.abs(dfx) + Math.abs(dfy) > accuracy) {
        acc = false;
      }

      return acc;
    }, true);
  };
}


const eq1 =  new Equation(() => 1, 21);
const eq2 =  new Equation(() => 2, 22);
const sone = new SONE([eq1, eq2]);
sone.solve();
