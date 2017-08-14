import { double } from './Cast';
import { dot, len, normal } from './cMath';


export class Vector2D {
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
    return len(this.x, this.y);
  }

  public clone():Vector2D {
    return new Vector2D(this.x, this.y);
  }

  public toString():string {
    return '(' + this.x + ' : ' + this.y + ')';
  }

  public static plus(v1:Vector2D, v2:Vector2D):Vector2D {
    return new Vector2D(v1.get_x() + v2.get_x(), v1.get_y() + v2.get_y());
  }

  public static minus(v1:Vector2D, v2:Vector2D):Vector2D {
    return new Vector2D(v1.get_x() - v2.get_x(), v1.get_y() - v2.get_y());
  }

  public static times(v1:Vector2D, v2:Vector2D):Vector2D {
    return new Vector2D(v1.get_x() * v2.get_x(), v1.get_y() * v2.get_y());
  }

  public static div(v1:Vector2D, v2:Vector2D):Vector2D {
    return new Vector2D(
      double(v1.get_x() / v2.get_x()),
      double(v1.get_y() / v2.get_y())
    );
  }
}
