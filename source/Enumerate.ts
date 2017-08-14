export function scope(start:number, end:number, fn:(iter:number) => void):void {
  for(let i:number = start; i <= end; i++) {
    fn(i);
  }
}
