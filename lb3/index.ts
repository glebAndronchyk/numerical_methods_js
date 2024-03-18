import {seidelClarify} from "../lb2-seidel";
import {add} from "mathjs";
import {Matrix} from "../lb2-seidel/types";

type FnType = (x:number, y:number) => number;

const epsilon = 0.01;

class Equation {
  private leftSide: FnType | null = null;

  constructor(private fn: FnType,
              private equals: number) {
  }

  toLeftSide(): FnType {
    if (!this.leftSide) {
      this.leftSide = (x: number, y: number) => this.fn(x, y) - this.equals;
    }

    return this.leftSide;
  }

  intersects(eq: Equation): [number, number] {
    return [0, 0];
  }

  getDerivationDelegates(d = 0.1) {
    const fn = this.toLeftSide();
    const dfnx = (x, y) => (fn(x + d, y) - fn(x, y)) / d;
    const dfny = (x, y) => (fn(x, y + d) - fn(x, y)) / d;

    return [dfnx, dfny];
  }

  getDerivativeByPoint(x, y, d = 0.1) {
    const fn = this.toLeftSide();
    const dfx = (fn(x + d, y) - fn(x, y)) / d;
    const dfy = (fn(x, y + d) - fn(x, y)) / d;

    return [dfx, dfy];
  }
}

class SONE {

  constructor(private equations: Equation[]) {}

  solve() {
    // const [x, y] = this.eq1.intersects(this.eq2);
    const [x, y] = [0.6,-0.4];

    const { x: clarifiedX, y: clarifiedY, jacobianDelegates } = this._clarifyStartValues(x, y);
    const P0 = [[clarifiedX], [clarifiedY]];

    return this._newtonsClarify(P0, jacobianDelegates);
  };

  private _newtonsClarify(start, jacobianDelegates) {
    const x = start[0][0];
    const y = start[1][0];

    const B = this._getEquationsResultAtPoint(x, y);
    const jacobian = jacobianDelegates.map((row) => row.map((fn) => fn(x, y)));
    const deltas = seidelClarify(jacobian, B).map((d) => [d]);
    const current = add(start, deltas);

    console.log(current);

    if (Math.abs(current[0][0] - x) > epsilon) {
      return this._newtonsClarify(current, jacobianDelegates);
    }

    return current;
  }

  private _getEquationsResultAtPoint(x, y) {
    return this.equations.map((eq) => ([eq.toLeftSide()(x, y)]));
  }
  private _clarifyStartValues(x: number, y: number, step = 0.01) {

    let currX = x;
    let currY = y;

    const processCurrent = (val) => val >= 0 ? val - step : val + step;

    while (true) {
      const derivation = this._createDerivativeMatrixByPoint(currX, currY);

      if (this._checkIntermediateResult(derivation)) {
        const jacobianDelegates = this._createJacobianDelegates();

        return {x: currX, y: currY, jacobianDelegates};
      }

      currX = processCurrent(currX);
      currY = processCurrent(currY);
    }
  };

  private _createJacobianDelegates() {
    return this.equations.map((eq) => eq.getDerivationDelegates());
  }

  private _createDerivativeMatrixByPoint = (x, y) => {
    return this.equations.map((eq) => eq.getDerivativeByPoint(x, y));
  };
  private _checkIntermediateResult = (derivation: number[][], accuracy = 5) => {
    return derivation.reduce((acc,  [dfx, dfy]) => {
      if (Math.abs(dfx) + Math.abs(dfy) > accuracy) {
        acc = false;
      }

      return acc;
    }, true);
  };
}


const eq1 =  new Equation((x, y) => 2 * x - 4 * Math.pow(y, 3), 1.5);
const eq2 =  new Equation((x, y) => 2 * Math.pow(x, 3) - 5 * Math.pow(y, 2), -0.25);
const sone = new SONE([eq1, eq2]);
console.log(sone.solve());
