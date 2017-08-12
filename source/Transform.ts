import { Component } from './Component';
import { GameObject } from './GameObject';

export class Transform implements Component {
  private readonly gameObject:GameObject;

  private readonly position:Vector2D;

  public constructor(gameObject:GameObject) {
    this.gameObject = gameObject;
  }
  
  public update():void {

  }
}