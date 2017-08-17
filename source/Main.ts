import { Vector } from './Vector';

class XD {
  private readonly x:number;
  constructor() {
    this.x = 4;
  }
}

class Main {
  public static main():void {
    const xd:XD = new XD;
    console.log(Object.getPrototypeOf(xd).constructor.name);
    console.log(XD.prototype === Object.getPrototypeOf(xd));
  }

  public static test<T extends Object>():void {

  }
}

Main.main();
