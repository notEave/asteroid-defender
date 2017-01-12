// jshint esversion:6, -W138

class Game {
  constructor() {
    Game.Initialize();
    this.queue = [
      new Scene(),
      new TurretHandler(),
      new AsteroidSpawner(),
      new TextElement(),
      new DeathScreen(),
    ];
  }
  Physics() {
    if(Game.finalScore === undefined && Game.lives <= 0) {
      Game.finalScore = Game.score;
    }
    this.DifficultyHandler();
    for(var n=0; n < this.queue.length; n++) {
      this.queue[n].Physics();
    }
  }
  Draw() {
    for(var n=0; n < this.queue.length; n++) {
      this.queue[n].Draw();
    }
  }
  DifficultyHandler() {
    if(time.frame.physics.start - Game.lastChange > 7000 && Game.difficulty > 1) {
      Game.lastChange = time.frame.physics.start;
      Game.difficulty--;
    }
  }
  static Initialize() {
    Game.lastChange = time.frame.physics.start;
    Game.ground = page.height - 100;
    Game.weapons = Math.ceil(page.width / 500);
    Game.difficulty = 70;
    Game.cooldown = 1;
    Game.bulletVel = 400;
    Game.bulletArray = [];
    Game.lives = Number.MAX_SAFE_INTEGER;// Number.MAX_SAFE_INTEGER;
    Game.score = 0;
  }
}

class TextElement {
  constructor() {
  }
  Physics() {

  }
  Draw() {
    canvas.content.font = '20px sans-serif';
    canvas.content.fillStyle = '#f33';
    canvas.content.textAlign = 'center';
    canvas.content.fillText(`Lives: ${Game.lives}`, 50, 25);
  }
}

class TurretHandler {
  constructor() {
    this.turretArray = [];
    this.Start();
  }
  Start() {
    for(var n = 0; n < Game.weapons; n++) {
      this.turretArray[n] = new TurretManager(n, page.width / Game.weapons);
    }
  }
  Physics() {
    for(var n = 0; n < this.turretArray.length; n++) {
      this.turretArray[n].Physics();
      this.turretArray[n].Events();
      Game.bulletArray[n] = this.turretArray[n].bulletArray;
    }
  }
  Draw() {
    for(var n = 0; n < this.turretArray.length; n++) {
      this.turretArray[n].Draw();
    }
  }
}

class TurretManager {
  constructor(arrayIndex, turretRegion) {
    this.position = {x: TurretManager.InitX(arrayIndex, turretRegion), y: Game.ground};
    this.Start(arrayIndex, turretRegion);
  }
  Start(arrayIndex, sectorSize) {
    this.color = {r: MathC.RandomRange(0, 70), g: MathC.RandomRange(0, 70), b: MathC.RandomRange(0, 70), a: 100};
    this.bulletSpeed = Game.bulletVel;
    this.cooldownTime = MathC.RandomRange(Game.cooldown - Game.cooldown / 10, Game.cooldown + Game.cooldown / 10);
    this.cooldownState = false;
    this.lastFired = time.frame.physics.start;
    this.anglePointer = {angle: TurretManager.SetAngle(this.position.y, this.position.x)};
    this.barrelLength = 25;
    this.bulletArray = [];
    this.turretBase = new TurretBase(this.position, this.color);
    this.turretBarrel = new TurretBarrel(this.position, this.color, this.anglePointer, this.barrelLength);
    this.turretLaser = new TurretLaser(this.position, this.anglePointer, this.barrelLength);
  }
  static InitX(arrayIndex, turretRegion) {
  return MathC.RandomRange(turretRegion * arrayIndex, turretRegion + turretRegion * arrayIndex);
  }
  GetCooldownState() {
    return time.frame.physics.start - this.lastFired < this.cooldownTime;
  }
  static SetAngle(turretY, turretX) {
    var angle = Math.atan2(hid.mouse.y - turretY, hid.mouse.x - turretX);
    if(angle < MathC.angle.Radians(-165) || angle > Math.PI / 2) {
      return MathC.angle.Radians(-165);
    } else if(angle > MathC.angle.Radians(-15)) {
      return MathC.angle.Radians(-15);
    } return angle;
  }
  Physics() {
    this.anglePointer.angle = TurretManager.SetAngle(this.position.y, this.position.x);
    for(var n = 0; n < this.bulletArray.length; n++) {
      this.bulletArray[n].Physics();
      if(this.bulletArray[n].OutofBounds()) {
        this.bulletArray.splice(n, 1);
      }
    }
    this.turretLaser.Physics();
    this.turretBarrel.Physics();
  }
  Events() {
    this.cooldownState = this.GetCooldownState();
    if(!this.cooldownState && hid.mouse.down) {
      this.lastFired = time.frame.physics.start;
      this.bulletArray.push(new TurretShot(this.position.x, this.position.y, this.anglePointer.angle, this.barrelLength));
    }
  }
  Draw() {
    for(var n = 0; n < this.bulletArray.length; n++) {
      this.bulletArray[n].Draw();
    }
    this.turretBase.Draw();
    this.turretLaser.Draw();
    this.turretBarrel.Draw();
  }
}

class TurretBase {
  constructor(position, color) {
    this.position = position;
    this.color = color;
  }
  Draw() {
    new Circle(this.position.x, this.position.y, [this.color.r, this.color.g, this.color.b, this.color.a], 15, MathC.TAU, Math.PI).Draw();
  }
}

class TurretBarrel {
  constructor(position, color, anglePointer, barrelLength) {
    this.position = position;
    this.color = color;
    this.anglePointer = anglePointer;
    this.barrelLength = barrelLength;
    this.barrelWidth = 6;
  }
  Physics() {
    this.barrelStart = {x: this.position.x + (this.barrelLength / 2) * Math.cos(this.anglePointer.angle), y: this.position.y + (this.barrelLength / 2) * Math.sin(this.anglePointer.angle)};
    this.end = {x: this.position.x + this.barrelLength * Math.cos(this.anglePointer.angle), y: this.position.y + this.barrelLength * Math.sin(this.anglePointer.angle)};
  }
  Draw() {
    new Line([this.barrelStart.x, this.barrelStart.y], [this.end.x, this.end.y], [this.color.r, this.color.g, this.color.b, this.color.a], this.barrelWidth).Draw();
  }
}

class TurretLaser {
  constructor(position, anglePointer, barrelLength) {
    this.position = position;
    this.anglePointer = anglePointer;
    this.barrelLength = barrelLength;
    this.color = !!MathC.RandomRange(0,1) ? [255, 0, 100, 20] : [0, 255, 100, 20];
  }
  Physics() {
    this.laserStart = {x: this.position.x + this.barrelLength * Math.cos(this.anglePointer.angle), y: this.position.y + this.barrelLength * Math.sin(this.anglePointer.angle)};
    this.end = {x: this.position.x + page.height * Math.cos(this.anglePointer.angle), y: this.position.y + page.height * Math.sin(this.anglePointer.angle)};
  }
  Draw() {
    var line = new GradientLine([this.laserStart.x, this.laserStart.y], [this.end.x, this.end.y], this.color, 2);
    line.colorStop[0] = 0.7;
    line.Draw();
  }
}

class TurretShot {
  constructor(positionX, positionY, direction, barrelLength) {
    this.direction = direction;
    this.barrelLength = barrelLength;
    this.position = {
      x: positionX + this.barrelLength * Math.cos(this.direction),
      y: positionY + this.barrelLength * Math.sin(this.direction)
    };
    this.velocity = {x: Game.bulletVel * Math.cos(this.direction), y: (Game.bulletVel * Math.sin(this.direction))};
    this.rgb = {r: MathC.RandomRange(50,100), g: MathC.RandomRange(150, 230), b: MathC.RandomRange(200, 255)};
  }
  Physics() {
    this.position.x += this.velocity.x * (time.frame.delta / 1000);
    this.position.y += this.velocity.y * (time.frame.delta / 1000);
  }
  Draw() {
    new GradientCircle(this.position.x, this.position.y, [this.rgb.r, this.rgb.g, this.rgb.g, 10] , 15, 5).Draw();
    new GradientCircle(this.position.x, this.position.y, [this.rgb.r, this.rgb.g, this.rgb.b, 100], 5, 2).Draw();
  }
  OutofBounds() {
    return this.position.x > page.width || this.position.x < 0 || this.position.y < 0 || this.position.y > Game.ground;
  }
}

class AsteroidSpawner {
  constructor() {
    this.asteroids = [];
  }
  Physics() {
    if(AsteroidSpawner.Chance(Game.difficulty)) {
      this.asteroids.push(new Asteroid());
    }
    for(let n = 0; n < this.asteroids.length; n++) {
      this.asteroids[n].Physics();
      if(this.asteroids[n].HitGround()) {
        Game.lives--;
      }
      var impacted = this.asteroids[n].CheckForImpacts();
      if(impacted) { Game.score++; }
      if(this.asteroids[n].OutOfBounds() || impacted) {
        this.asteroids.splice(n, 1);
      }
    }
  }
  Draw() {
    for(let n = 0; n < this.asteroids.length; n++) {
      this.asteroids[n].Draw();
    }
  }
  static Chance(chance) {
    return chance == MathC.RandomRange(1, chance);
  }
}

class Asteroid {
  constructor() {
    this.position = {
      x: MathC.RandomRange(0, page.width),
      y: 0,
    };
    this.velocity = {
      x: MathC.RandomRange(-30, 30),
      y: MathC.RandomRange(30, 150),
    };
    this.rgb = !!MathC.RandomRange(0,1) ? {r: MathC.RandomRange(150, 255), g: MathC.RandomRange(25, 125), b: MathC.RandomRange(25, 50)}
    : {r: MathC.RandomRange(25, 125), g: MathC.RandomRange(25, 50), b: MathC.RandomRange(150, 225)};
    this.asteroidTrail = [];
  }
  Physics() {
    this.position.x += this.velocity.x * (time.frame.delta / 1000);
    this.position.y += this.velocity.y * (time.frame.delta / 1000);
    if(time.frame.current % 10 === 0) {
      this.asteroidTrail.unshift(new AsteroidTrail(this.position.x, this.position.y, [this.rgb.r, this.rgb.g, this.rgb.b]));
    }
    if(this.asteroidTrail.length > 10) {
      this.asteroidTrail.splice(10, 1);
    }
    for(var n = 0; n < this.asteroidTrail.length; n++) {
      this.asteroidTrail[n].Physics();
    }
  }
  Draw() {
    for(var n = 0; n < this.asteroidTrail.length; n++) {
      this.asteroidTrail[n].Draw();
    }
    new GradientCircle(this.position.x, this.position.y, [this.rgb.r, this.rgb.g, this.rgb.b, 100], 10, 5).Draw();
  }
  OutOfBounds() {
    return this.position.x > page.width || this.position.x < 0 || this.position.y > Game.ground;
  }
  HitGround() {
    return this.position.y > Game.ground;
  }
  CheckForImpacts() {
    for(var n = 0; n < Game.bulletArray.length; n++) {
      for(var i = 0; i < Game.bulletArray[n].length; i++) {
        if (Math.pow(this.position.x-Game.bulletArray[n][i].position.x, 2) + Math.pow(Game.bulletArray[n][i].position.y-this.position.y, 2) <= Math.pow(10+5, 2)) {
          return true; // else continue checking through array
        }
      }
    }
  }
}

class AsteroidTrail {
  constructor(positionx, positiony, astColor) {
    this.position = {x: positionx, y: positiony};
    this.rgba = {r: astColor[0], g: astColor[1], b: astColor[2], a: 100 / 4};
  }
  Physics() {
    this.rgba.a += -0.25;
  }
  Draw() {
    new GradientCircle(this.position.x, this.position.y, [this.rgba.r, this.rgba.g, this.rgba.b, this.rgba.a], 25, 5).Draw();
  }
}

class Scene {
  constructor() {
    this.background = new Square('000', 0, page.height);
    this.land = new Square('101510', page.height - 100, page.height);
    this.stars = new StarSys();
  }
  Physics() {
    this.stars.Physics();
  }
  Draw() {
    this.background.Draw();
    this.land.Draw();
    this.stars.Draw();
  }
}

class Square {
  constructor(color, start) {
    this.color = `#${color}`;
    this.start = start;
  }
  Draw() {
    canvas.content.fillStyle = this.color;
    canvas.content.fillRect(0, this.start, page.width, page.height - this.start);
  }
}

class StarSys {
  constructor() {
    this.stars = StarSys.CreateStars();
  }
  static CreateStars() {
    let starArray = new Array(MathC.Round(page.width * page.height / 10000));
    for(let n = 0; n < starArray.length; n++) {
      starArray[n] = new Star(MathC.RandomRange(0, page.width), MathC.RandomRange(0, Game.ground - 20));
    }
    return starArray;
  }
  Physics() {
    for(var n = 0; n < this.stars.length; n++) {
      this.stars[n].Physics();
    }
  }
  Draw() {
    for(let n = 0; n < this.stars.length; n++) {
      this.stars[n].Draw();
    }
  }
}

class Star {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.rgba = {r: 255, g: 255, b: 255, a: 1};

  }
  Physics() {
    if(!!MathC.RandomRange(0, 100)) {
      this.rgba.a = 1;
    } else {
      this.rgba.a = 0;
    }
  }
  Draw() {
    canvas.content.fillStyle = `rgba(${this.rgba.r},${this.rgba.g},${this.rgba.b},${this.rgba.a})`;
    canvas.content.fillRect(this.x, this.y, 1, 1);
  }
}

class DeathScreen {
  constructor() {
    this.transparency = 50;
    this.peaked = true;
    this.bottomed = false;
  }
  Physics() {
    this.transparency += this.peaked ? -1 : 0;
    this.transparency += this.bottomed ? 1 : 0;
    [this.peaked, this.bottomed] = this.transparency == 50 ? [true, false] : [this.peaked, this.bottomed];
    [this.peaked, this.bottomed] = this.transparency === 0 ? [false, true] : [this.peaked, this.bottomed];
  }
  Draw() {
    if(Game.lives <= 0) {
      canvas.content.fillStyle = '#000';
      canvas.content.fillRect(0, 0, page.width, page.height);
      canvas.content.font = '100px sans-serif';
      canvas.content.fillStyle = 'rgba(255, 40, 40,' + this.transparency / 100 + ')';
      canvas.content.textAlign = 'center';
      canvas.content.fillText('Dead', page.width / 2, page.height / 2);
      canvas.content.fillText(`Score: ${(Game.finalScore * 10).toLocaleString()}`, page.width / 2, page.height * 0.8);
    }
  }
}
class Circle {
  constructor(positionx, positiony, color = [], radius, circumference = MathC.TAU, rotation = 0) {
    this.position = {x: positionx, y: positiony};
    this.rgba =  {r: color[0], g: color[1], b: color[2], a: color[3] / 100};
    this.radius = radius;
    this.circumference = circumference;
    this.rotation = rotation;
  }
  Draw() {
    canvas.content.fillStyle = `rgba(${this.rgba.r},${this.rgba.g},${this.rgba.b},${this.rgba.a})`;
    canvas.content.beginPath();
    canvas.content.arc(this.position.x, this.position.y, this.radius, this.rotation, this.circumference);
    canvas.content.closePath();
    canvas.content.fill();
  }
}

class GradientCircle extends Circle {
  constructor(positionx, positiony, color, radius, gradientStart) {
    super(positionx, positiony, color, radius);
    this.gradientStart = gradientStart;
  }
  Draw() {
    var gradient = canvas.content.createRadialGradient(this.position.x, this.position.y, this.gradientStart, this.position.x, this.position.y, this.radius);
    gradient.addColorStop(0, `rgba(${this.rgba.r},${this.rgba.g},${this.rgba.b},${this.rgba.a})`);
    gradient.addColorStop(1, 'transparent');
    canvas.content.fillStyle = gradient;
    canvas.content.beginPath();
    canvas.content.arc(this.position.x, this.position.y, this.radius, 0, MathC.TAU);
    canvas.content.closePath();
    canvas.content.fill();
  }
}

class Line {
  constructor(start, end, color, lineWidth = 1) {
    this.start = {x: start[0], y: start[1]};
    this.end = {x: end[0], y: end[1]};
    this.rgba = {r: color[0], g: color[1], b: color[2], a: color[3] / 100};
    this.lineWidth = lineWidth;
  }
  Draw() {
    canvas.content.lineWidth = this.lineWidth;
    canvas.content.strokeStyle = `rgba(${this.rgba.r},${this.rgba.g},${this.rgba.b},${this.rgba.a})`;
    canvas.content.beginPath();
    canvas.content.moveTo(this.start.x, this.start.y);
    canvas.content.lineTo(this.end.x, this.end.y);
    canvas.content.closePath();
    canvas.content.stroke();
  }
}

class GradientLine extends Line {
  constructor(start, end, color, lineWidth = 1) {
    super(start, end, color, lineWidth);
    this.colorStop = [0, 1];
  }
  Draw() {
    var gradient = canvas.content.createLinearGradient(this.start.x, this.start.y, this.end.x, this.end.y);
    gradient.addColorStop(this.colorStop[0], `rgba(${this.rgba.r},${this.rgba.g},${this.rgba.b},${this.rgba.a})`);
    gradient.addColorStop(this.colorStop[1], 'transparent');
    canvas.content.lineWidth = this.lineWidth;
    canvas.content.strokeStyle = gradient;
    canvas.content.beginPath();
    canvas.content.moveTo(this.start.x, this.start.y);
    canvas.content.lineTo(this.end.x, this.end.y);
    canvas.content.closePath();
    canvas.content.stroke();
  }
}
