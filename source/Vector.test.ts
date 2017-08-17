import { Vector } from './Vector';

test('arithmetic operations', () => {
  const plus: (v1:Vector, v2:Vector) => Vector = Vector.plus ;
  const minus:(v1:Vector, v2:Vector) => Vector = Vector.minus;
  const times:(v1:Vector, v2:Vector) => Vector = Vector.times;
  const div:  (v1:Vector, v2:Vector) => Vector = Vector.div  ;

  const VEC1:Vector = new Vector(10,  5);
  const VEC2:Vector = new Vector( 5, 10);

  expect(plus (VEC1, VEC2)).toMatchObject(new Vector(15,  15  ));
  expect(minus(VEC1, VEC2)).toMatchObject(new Vector( 5, - 5  ));
  expect(times(VEC1, VEC2)).toMatchObject(new Vector(50,  50  ));
  expect(div  (VEC1, VEC2)).toMatchObject(new Vector(2,    0.5));
});

test('toString method', () => {
  const VEC:Vector = new Vector(0, 0);
  expect(VEC.toString()).toBe('(0 : 0)');
});


test('getters, setters', () => {
  const X:number = 0;
  const Y:number = 0;

  const VEC:Vector = new Vector(X, Y);

  expect(VEC.get_x()).toBe(X);
  expect(VEC.get_y()).toBe(Y);

  const NEW_X:number =  5;
  const NEW_Y:number = 10;

  VEC.set_x(NEW_X);
  VEC.set_y(NEW_Y);

  expect(VEC.get_x()).toBe(NEW_X);
  expect(VEC.get_y()).toBe(NEW_Y);
});

test('length',() => {
  expect(new Vector( 10,  10).length()).toBeCloseTo(14.1421356, 0.01);
  expect(new Vector(-10, -10).length()).toBeCloseTo(14.1421356, 0.01);

  expect(new Vector(-10, -10).lengthSquared).toBe(200);
  expect(new Vector(-10, -10).lengthSquared).toBe(200);
});

test('normal', () => {
  expect(new Vector(0,  1).normal()).toMatchObject(new Vector(0,  1));
  expect(new Vector(1,  0).normal()).toMatchObject(new Vector(1,  0));
  expect(new Vector(0, -1).normal()).toMatchObject(new Vector(0, -1));
});
