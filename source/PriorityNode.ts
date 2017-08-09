import { int } from './Cast';

export class PriorityNode<T> {
  private readonly priority:number;
  private readonly value:T;

  public constructor(value:T, priority:number) {
    this.value = value;
    this.priority = int(priority);
  }

  public getPriority():number {
    return this.priority;
  }

  public getValue():T {
    return this.value;
  }
}