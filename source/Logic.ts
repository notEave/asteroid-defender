import { PriorityStack } from './PriorityStack';
import {LogicObject } from './LogicObject';

export class Logic implements LogicObject {
  private readonly updateStack:PriorityStack<LogicObject>;

  public constructor(updateStack:PriorityStack<LogicObject>) {
    this.updateStack = updateStack;
  }

  public update():void {
    for(const EL of this.updateStack) {
      EL.update();
    }
  }
}