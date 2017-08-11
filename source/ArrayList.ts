import { List } from './List';
import { uint } from './Cast';

export class ArrayList<T> implements List<T> {

  private readonly array:Array<T>;

  public constructor() {
    this.array = new Array<T>();
  }

  public put(value:T, index?:number):void {
    if(index !== undefined) {
      const INDEX:number = uint(index);
      if(this.contains(INDEX) || INDEX === this.length()) {
        this.array[INDEX] = value;
      } else {
        throw new Error('Index not in bounds of list');
      }
    } else {
      this.array[this.length()] = value;
    }
  }

  public peek(index:number):T {
    const INDEX:number = uint(index);
    if(this.contains(INDEX) === false) {
      throw new Error('Index not in bounds of list');
    }

    return this.array[INDEX];
  }

  public take(index:number):T {
    const INDEX:number = uint(index);
    if(this.contains(INDEX) === false) {
      throw new Error('Index not in bounds of list');
    }

    return this.array.splice(INDEX, 1)[0];
  }

  public clear():void {
    this.array.length = 0;
  }

  public length():number {
    return this.array.length;
  }

  private contains(index:number):boolean {
    const INDEX:number = uint(index);
    return 0 <= INDEX && INDEX < this.length();
  }

  *[Symbol.iterator]():IterableIterator<T> {
    for(const EL of this.array) {
      yield EL;
    }
  }

  public forEach(fn:(v:T) => void):void {
    this.array.forEach(fn);
  }
}
