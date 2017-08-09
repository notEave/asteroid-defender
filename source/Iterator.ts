export class Iterator<T> {
  private readonly array:Array<T>;
  private counter:number;
  public constructor(array:Array<T>) {
    this.array = array;
    this.counter = 0;
  }

  public reset():void {
    this.counter = 0;
  }

  public hasNext():boolean {
    return this.counter < this.array.length;
  }

  public next():T {
    return this.array[this.counter++];
  }

  *[Symbol.iterator]():IterableIterator<T> {
    for(const EL of this.array) {
      yield EL;
    }
  }

  public forEach(fn:(v:T) => void):void {
    this.array.forEach(v => fn(v));
  }
}