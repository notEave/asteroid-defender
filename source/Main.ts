import { LogicObject } from './LogicObject';
import { GameObject } from './GameObject';
import { cMath } from './cMath';
import { distance } from './cMath';

class Main {
  public static main():void {
    console.log(distance(0, 0, 10, 10));
  }
}

Main.main();
