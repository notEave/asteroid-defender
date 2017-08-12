import { double } from './Cast';

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
    this.x = double(y);
  }

  public get_x():number {
    return this.x;
  }

  public get_y():number {
    return this.y;
  }

  public clone():Vector2D {
    return new Vector2D(this.x, this.y);
  }

  public toString():string {
    return `${this.x} , ${this.y}`;
  }
}