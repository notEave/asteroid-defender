import { cMath } from './cMath';

test("cMath average", () => {

  const fn:(arr:Array<number>) => number = cMath.average;
  expect(fn([0, 1, 2, 3, 4, 5])).toBeCloseTo(2.5, 0.05);
  expect(fn([                ])).toBe(0);
  expect(fn([0               ])).toBe(0);
  expect(fn([-1, 1           ])).toBe(0);
});


test('cMath inRange', () => {
  const fn:(v:number,min:number,max:number) => boolean = cMath.inRange;

  expect(fn(0  ,  1  ,  2  )).toBe(true );
  expect(fn(0  ,  0  ,  0  )).toBe(true );
  expect(fn(0  , -1  ,  1  )).toBe(false);
  expect(fn(0  ,  0  , -1  )).toBe(false);
  expect(fn(0.5,  0.6,  0.7)).toBe(true );
  expect(fn(0  ,  3  ,  2  )).toBe(false);
});

test('cMath round', () => {
  const fn:(value:number, precision:number) => number = cMath.round;

  expect(fn(0  ,  0)).toBe(0);
  expect(fn(0.5,  0)).toBe(1);
  expect(fn(0.5,  1)).toBeCloseTo(0.5, 0.01); // round to closest .1's
  expect(fn(4  , -1)).toBe(0); // round to closest 10's
  expect(fn(5  , -1)).toBe(10);
});


test('cMath floor', () => {
  const fn:(value:number, precision:number) => number = cMath.floor;

  expect(fn(0   ,  0)).toBe(0);
  expect(fn(0.5 ,  0)).toBe(0);
  expect(fn(0.55,  1)).toBeCloseTo(0.5, 0.01);
  expect(fn(4   , -1)).toBe(0);
  expect(fn(5   , -1)).toBe(0);
});

test('cMath ceil', () => {
  const fn:(value:number, precision:number) => number = cMath.ceil;

  expect(fn(0   ,  0)).toBe(0);
  expect(fn(0.5 ,  0)).toBe(1);
  expect(fn(0.55,  1)).toBeCloseTo(0.6, 0.01);
  expect(fn(4   , -1)).toBe(10);
  expect(fn(5   , -1)).toBe(10);
});

test('cMath len', () => {
  const fn:(x:number, y:number) => number = cMath.len;

  expect(fn(10,  10)).toBeCloseTo(14.1421356, 0.01);
  expect(fn(10, -10)).toBeCloseTo(14.1421356, 0.01);

  expect(fn(0,  10)).toBe(10);
  expect(fn(0, -10)).toBe(10);

});

test('cMath normal', () => {
  const fn:(x:number, y:number) => Array<number> = cMath.normal;
  expect(fn(1, 1)[0]).toBeCloseTo(0.707106, 0.01);
  expect(fn(1, 1)[1]).toBeCloseTo(0.707106, 0.01);

  expect(fn(0,  1)).toMatchObject([0,  1]);
  expect(fn(0, -1)).toMatchObject([0, -1]);
});

test('cMath dot', () => {
  const fn:(x1:number, y1:number, x2:number, y2:number) => number = cMath.dot;

  expect(fn(0,  1, 0, 1)).toBe( 1);
  expect(fn(0, -1, 0, 1)).toBe(-1);
  expect(fn(0,  1, 1, 0)).toBe( 0);

  expect(fn(0, 0, 0, 0)).toBe(0);
});
