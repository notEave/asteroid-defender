import { Vector2D } from './Vector2D';

test('arithmetic operations', () => {
  const plus: (v1:Vector2D, v2:Vector2D) => Vector2D = Vector2D.plus ;
  const minus:(v1:Vector2D, v2:Vector2D) => Vector2D = Vector2D.minus;
  const times:(v1:Vector2D, v2:Vector2D) => Vector2D = Vector2D.times;
  const div:  (v1:Vector2D, v2:Vector2D) => Vector2D = Vector2D.div  ;

  const VEC1:Vector2D = new Vector2D(10,  5);
  const VEC2:Vector2D = new Vector2D( 5, 10);

  expect(plus (VEC1, VEC2)).toMatchObject(new Vector2D(15,  15  ));
  expect(minus(VEC1, VEC2)).toMatchObject(new Vector2D( 5, - 5  ));
  expect(times(VEC1, VEC2)).toMatchObject(new Vector2D(50,  50  ));
  expect(div  (VEC1, VEC2)).toMatchObject(new Vector2D(2,    0.5));
});

test('toString method', () => {
  const VEC:Vector2D = new Vector2D(0, 0);
  expect(VEC.toString()).toBe('(0 : 0)');
});


test('getters, setters', () => {
  const X:number = 0;
  const Y:number = 0;

  const VEC:Vector2D = new Vector2D(X, Y);

  expect(VEC.get_x()).toBe(X);
  expect(VEC.get_y()).toBe(Y);

  const NEW_X:number =  5;
  const NEW_Y:number = 10;

  VEC.set_x(NEW_X);
  VEC.set_y(NEW_Y);

  expect(VEC.get_x()).toBe(NEW_X);
  expect(VEC.get_y()).toBe(NEW_Y);
});
