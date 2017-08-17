import { double } from './Cast';

export class Vector {
  private x:number;
  private y:number;

  public constructor(x:number, y:number) {
    this.x = double(x);
    this.y = double(y);
  }

  public set_x(x:number):void {
    this.x = double(x);
  }

  public set_y(y:number):void {
    this.y = double(y);
  }

  public get_x():number {
    return this.x;
  }

  public get_y():number {
    return this.y;
  }

  public length():number {
    return Math.sqrt(this.lengthSquared());
  }

  public lengthSquared():number {
    return this.x * this.x + this.y * this.y;
  }

  public normalized():Vector {
    const LENGTH:number = this.length();
    
    return new Vector(double(this.x / LENGTH), double(this.y / LENGTH));
  }

  public to(target:Vector):Vector {
    return Vector.minus(target, this);
  }

  public clone():Vector {
    return new Vector(this.x, this.y);
  }

  public toString():string {
    return '(' + this.x + ' : ' + this.y + ')';
  }

  public static plus(v1:Vector, v2:Vector):Vector {
    return new Vector(v1.get_x() + v2.get_x(), v1.get_y() + v2.get_y());
  }

  public static minus(v1:Vector, v2:Vector):Vector {
    return new Vector(v1.get_x() - v2.get_x(), v1.get_y() - v2.get_y());
  }

  public static times(v1:Vector, v2:Vector):Vector {
    return new Vector(v1.get_x() * v2.get_x(), v1.get_y() * v2.get_y());
  }

  public static div(v1:Vector, v2:Vector):Vector {
    return new Vector(
      double(v1.get_x() / v2.get_x()),
      double(v1.get_y() / v2.get_y())
    );
  }

  public static dotProduct(v1:Vector, v2:Vector):number {
    return v1.get_x()  * v2.get_x() + v1.get_y() * v2.get_y();
  }
}
