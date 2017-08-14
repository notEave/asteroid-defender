import { LogicObject } from './LogicObject';
import { GameObject } from './GameObject';
import { cMath } from './cMath';
import { len } from './cMath';
import { Transform } from './Transform';
import { scope } from './Enumerate';

class Main {
  public static main():void {
    scope(0, 100, i => {
      console.log('xd');
    });
  }
}

Main.main();
