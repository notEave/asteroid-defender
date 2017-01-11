// jshint esversion:6

class Game {
  constructor() {
    Game.Initialize();
    this.lastChange = time.frame.physics.start;
    this.spawner = new AsteroidSpawner();
    this.scene = new Scene();
    this.player = new PlayerHandler();
    this.deathScreen = new DeathScreen();
    this.lives = new Text();
  }
  Physics() {
    if(Game.finalScore === undefined && Game.lives <= 0) {
      Game.finalScore = Game.score;
    }
    this.DifficultyHandler();
    this.scene.Physics();
    this.player.Physics();
    this.spawner.Physics();
    this.deathScreen.Refresh();
  }
  Draw() {
    this.scene.Draw();
    this.spawner.Draw();
    this.player.Draw();
    this.lives.Draw();
    if(Game.lives <= 0) {
      this.deathScreen.Draw();
    }
  }
  DifficultyHandler() {
    if(time.frame.physics.start - this.lastChange > 7000 && Game.difficulty > 1) {
      this.lastChange = time.frame.physics.start;
      Game.difficulty--;
    }
  }
  static Initialize() {
    Game.ground = page.height - 100;
    Game.weapons = Math.ceil(page.width / 500);
    Game.difficulty = 70;
    Game.cooldown = 10;
    Game.bulletVel = 400;
    Game.bulletArray = [];
    Game.lives = Number.MAX_SAFE_INTEGER;// Number.MAX_SAFE_INTEGER;
    Game.score = 0;
  }
}

class Text {
  constructor() {
  }
  Draw() {
    canvas.content.font = '20px sans-serif';
    canvas.content.fillStyle = '#f33';
    canvas.content.textAlign = 'center';
    canvas.content.fillText(`Lives: ${Game.lives}`, 50, 25);
  }
}

class PlayerHandler {
  constructor() {
    this.turrets = this.InitializeWeapons();
  }
  InitializeWeapons() {
    let turretArray = [];
    for(var n = 0; n < Game.weapons; n++) {
      turretArray[n] = new Turret(n, page.width / Game.weapons);
    }
    return turretArray;
  }
  Physics() {
    for(var n = 0; n < this.turrets.length; n++) {
      this.turrets[n].Physics();
      this.turrets[n].Events();
      Game.bulletArray[n] = this.turrets[n].turretHandler.bulletArray;
    }
  }
  Draw() {
    for(var n = 0; n < this.turrets.length; n++) {
      this.turrets[n].Draw();
    }
  }
}

class Turret {
  constructor(batteryIndex, sectorSize) {
    this.position = {x: this.InitPositionX(batteryIndex, sectorSize), y: Game.ground};
    this.laser = new Laser(this.position);
    this.turretHandler = new TurretHandler(this.position);
  }
  InitPositionX(batteryIndex, sectorSize) {
    return MathC.RandomRange(sectorSize * batteryIndex, sectorSize + sectorSize * batteryIndex);
  }
  Physics() {
    this.laser.Physics();
    this.turretHandler.Physics();
  }
  Events() {
    this.turretHandler.Events();
  }
  Draw() {
    this.laser.Draw();
    this.turretHandler.Draw();
    new Circle(this.position.x, this.position.y, [34, 51, 68, 100], 10, MathC.TAU, Math.PI).Draw();
  }
}

class TurretHandler {
  constructor(position) {
    this.origin = position;
    this.cooldown = MathC.RandomRange(Game.cooldown - Game.cooldown / 10, Game.cooldown + Game.cooldown / 10);
    this.angle = Math.atan2(eventlib.mouse.position.y - this.origin.y, eventlib.mouse.position.x - this.origin.x);
    this.state = {cooldown: false, lastFired: 0};
    this.bulletArray = [];
  }
  Physics() {
    this.angle = Math.atan2(eventlib.mouse.position.y - this.origin.y, eventlib.mouse.position.x - this.origin.x);
    for(var n = 0; n < this.bulletArray.length; n++) {
      this.bulletArray[n].Physics();

      if(this.bulletArray[n].OutofBounds()) {
        this.bulletArray.splice(n, 1);
      }
    }
  }
  Events() {
    this.state.cooldown = this.GetCooldownState();
    if(!this.state.cooldown && eventlib.mouse.down) {
      this.state.lastFired = time.frame.physics.start;
      this.bulletArray.push(new Bullet(this.origin.x, this.origin.y, this.angle));
    }
  }
  Draw() {
    for(var n = 0; n < this.bulletArray.length; n++) {
      this.bulletArray[n].Draw();
    }
  }
  GetCooldownState() {
    return time.frame.physics.start - this.state.lastFired < this.cooldown;
  }
}

class Bullet {
  constructor(originx, originy, angle) {
    this.position = {x: originx, y: originy};
    this.velocity = {x: Game.bulletVel * Math.cos(angle), y: (Game.bulletVel * Math.sin(angle))};
    this.rgb = {r: MathC.RandomRange(50,100), g: MathC.RandomRange(150, 230), b: MathC.RandomRange(200, 255)};
  }
  Physics() {
    this.position.y += this.velocity.y * (time.frame.delta / 1000);
    this.position.x += this.velocity.x * (time.frame.delta / 1000);
  }
  Draw() {
    new GradientCircle(this.position.x, this.position.y, [this.rgb.r, this.rgb.g, this.rgb.g, 10] , 15, 5).Draw();
    new GradientCircle(this.position.x, this.position.y, [this.rgb.r, this.rgb.g, this.rgb.b, 100], 5, 2).Draw();
  }
  OutofBounds() {
    return this.position.x > page.width || this.position.x < 0 || this.position.y < 0 || this.position.y > Game.ground;
  }
}

class Laser {
  constructor(position) {
    this.origin = position;
    this.mouse = eventlib.mouse.position;
    this.angle = Math.atan2(eventlib.mouse.position.y - this.origin.y, eventlib.mouse.position.x - this.origin.x);
    this.end = {x: 500 * Math.cos(this.angle), y: 500 * Math.sin(this.angle)};
    console.log(this.end.x, this.end.y);
    this.ratio = (this.mouse.x - this.origin.x) / (this.origin.y - this.mouse.y);
    if(!!MathC.RandomRange(0,1)) {
      this.color = [255, 0, 100, 20];
    } else {
      this.color = [0, 255, 100, 20];
    }
  }
  Physics() {
    this.mouse = eventlib.mouse.position;
    this.angle = Math.atan2(eventlib.mouse.position.y - this.origin.y, eventlib.mouse.position.x - this.origin.x);
    this.end = {x: 500 * Math.cos(this.angle), y: 500 * Math.sin(this.angle)};
    this.ratio = (this.mouse.x - this.origin.x) / (this.origin.y - this.mouse.y);
  }
  Draw() {
    new GradientLine([this.origin.x, this.origin.y], [this.end.x, this.end.y], this.color, 2).Draw();
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
      y: -5,
    };
    this.velocity = {
      x: MathC.RandomRange(-3, 3),
      y: MathC.RandomRange(3, 15),
    };
    this.rgb = {r: MathC.RandomRange(150, 255), g: MathC.RandomRange(25, 125), b: MathC.RandomRange(25, 50) };
    this.asteroidTrail = [];
  }
  Physics() {
    this.position.x += this.velocity.x * (time.frame.delta / 100);
    this.position.y += this.velocity.y * (time.frame.delta / 100);
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
    this.land = new Square('120', page.height - 100, page.height);
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
  Refresh() {
    if(this.peaked) {
      this.transparency--;
    }
    if(this.bottomed) {
      this.transparency++;
    }
    if(this.transparency == 50) {
      this.peaked = true;
      this.bottomed = false;
    }
    if(this.transparency === 0) {
      this.peaked = false;
      this.bottomed = true;
    }
  }
  Draw() {
    canvas.content.fillStyle = '#000';
    canvas.content.fillRect(0, 0, page.width, page.height);
    canvas.content.font = '100px sans-serif';
    canvas.content.fillStyle = 'rgba(255, 40, 40,' + this.transparency / 100 + ')';
    canvas.content.textAlign = 'center';
    canvas.content.fillText('Dead', page.width / 2, page.height / 2);
    canvas.content.fillText(`Score: ${(Game.finalScore * 10).toLocaleString()}`, page.width / 2, page.height * 0.8);
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
  }
  Draw() {
    var gradient = canvas.content.createLinearGradient(this.start.x, this.start.y, this.end.x, this.end.y);
    gradient.addColorStop(0, `rgba(${this.rgba.r},${this.rgba.g},${this.rgba.b},${this.rgba.a})`);
    gradient.addColorStop(1, 'transparent');
    canvas.content.lineWidth = this.lineWidth;
    canvas.content.strokeStyle = gradient;
    canvas.content.beginPath();
    canvas.content.moveTo(this.start.x, this.start.y);
    canvas.content.lineTo(this.end.x, this.end.y);
    canvas.content.closePath();
    canvas.content.stroke();
  }
}
