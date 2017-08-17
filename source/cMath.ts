import { double, int } from './Cast';

/**
 * Stateless math class
 */
export class cMath {
  public static inRange(min:number, value:number, max:number):boolean {
    return min <= value && value <= max;
  }

  public static average(numbers:Array<number>):number {
    if(numbers.length === 0) {
      return 0;
    }

    let total:number = 0;

    numbers.forEach(v => total += double(v));

    return total / numbers.length;
  }

  public static round(value:number, precision:number):number {
    const PRECISION_MULTIPLIER:number = 10;
    let valueMultiplier:number;

    valueMultiplier = Math.pow(PRECISION_MULTIPLIER, int(precision));

    return Math.round(double(value) * valueMultiplier) / valueMultiplier;
  }

  public static floor(value:number, precision:number):number {
    const PRECISION_MULTIPLIER:number = 10;
    let valueMultiplier:number;

    valueMultiplier = Math.pow(PRECISION_MULTIPLIER, int(precision));

    return Math.floor(double(value) * valueMultiplier) / valueMultiplier;
  }

  public static ceil(value:number, precision:number):number {
    const PRECISION_MULTIPLIER:number = 10;
    let valueMultiplier:number;

    valueMultiplier = Math.pow(PRECISION_MULTIPLIER, int(precision));

    return Math.ceil(double(value) * valueMultiplier) / valueMultiplier;
  }
}

export function inRange(value:number, min:number, max:number):boolean {
  return cMath.inRange(value, min, max);
}

export function average(numbers:Array<number>):number {
  return cMath.average(numbers);
}

export function round(value:number, precision:number):number {
  return cMath.round(value, precision);
}

export function floor(value:number, precision:number):number {
  return cMath.floor(value, precision);
}

export function ceil(value:number, precision:number):number {
  return cMath.ceil(value, precision);
}
