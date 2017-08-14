import { Component } from './Component';
import { GameObject } from './GameObject';
import { Vector2D } from './Vector2D';

export class Transform implements Component {
  private readonly gameObject:GameObject;

  private readonly position:Vector2D;

  public constructor(gameObject:GameObject) {
    this.gameObject = gameObject;
    this.position = new Vector2D(0, 0);
  }

  public update():void {

  }
}
