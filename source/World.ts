import { LogicObject } from './LogicObject';
import { RenderObject } from './RenderObject';
import { GameObject } from './GameObject';
import { List } from './List';

export class World implements LogicObject, RenderObject {
  private readonly gameObjects:List<GameObject>;

  public constructor() {
  }

  public update():void {

  }

  public render():void {

  }

}
