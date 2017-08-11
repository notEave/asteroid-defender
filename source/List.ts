export interface List<T> {
  put(value:T, index?:number):void;
  peek(index:number):T;
  take(index:number):T;
  length():number;
  clear():void;
  forEach(fn:(v:T) => void):void;
}
