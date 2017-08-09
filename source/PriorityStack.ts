import { Iterator } from './Iterator';
import { PriorityNode } from './PriorityNode';

/**
 * Elements are sorted based on their given priority value. 
 */
export class PriorityStack<T> {
  private readonly array:Array<PriorityNode<T>>;

  public constructor() {
    this.array = new Array<PriorityNode<T>>();
  }


  public put(value:T, priority:number):void {
    const NODE:PriorityNode<T> = new PriorityNode<T>(value, priority);
    if(this.isEmpty()) {
      this.array[0] = NODE;
      return;
    }

    let current:PriorityNode<T>;
    for(let i:number = 0; i < this.array.length; i++) {
      current = this.array[i];

      if(NODE.getPriority() < current.getPriority()) {
        this.array.splice(i, 0, NODE);
        return;
      }
    }

    this.array.push(NODE);
  }

  public length():number {
    return this.array.length;
  }

  public remove(obj:T):T {
    let current:PriorityNode<T>;
    for(let i:number = 0; i < this.array.length; i++) {
      current = this.array[i];

      if(current.getValue() === obj) {
        this.array.splice(i, 1);
      }
    }
    throw new Error('No object' + obj + 'in collection');
  }

  public iterator():Iterator<T> {
    const values:Array<T> = new Array<T>();
    for(const EL of this) {
      values.push(EL);
    }
    return new Iterator<T>(values);
  }

  public contains(obj:T):boolean {
    let current:PriorityNode<T>;

    for(let i:number = 0; i < this.array.length; i++) {
      current = this.array[i];
      if(current.getValue() === obj) {
        return true;
      }
    }
    return false;
  }

  public clear():void {
    this.array.length = 0;
  }

  public isEmpty():boolean {
    return this.array.length === 0;
  }

  *[Symbol.iterator]():IterableIterator<T> {
    for(const EL of this.array) {
      yield EL.getValue();
    }
  }
}