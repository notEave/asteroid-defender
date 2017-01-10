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
    Game.difficulty = 40;
    Game.cooldown = 600;
    Game.bulletVel = 40;
    Game.bulletArray = [];
    Game.lives = Number.MAX_SAFE_INTEGER;
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
    canvas.content.fillText('Lives: ' + Game.lives, 50, 25);
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
    canvas.content.fillStyle = '#234';
    canvas.content.beginPath();
    canvas.content.arc(this.position.x, this.position.y, 10, 0, Math.PI, true);
    canvas.content.closePath();
    canvas.content.fill();
  }
}

class TurretHandler {
  constructor(position) {
    this.origin = position;
    this.cooldown = MathC.RandomRange(Game.cooldown - Game.cooldown / 10, Game.cooldown + Game.cooldown / 10);
    this.direction = (eventlib.mouse.position.x - this.origin.x) / (this.origin.y - eventlib.mouse.position.y);
    this.state = {cooldown: false, lastFired: 0};
    this.bulletArray = [];
  }
  Physics() {
    this.direction = (eventlib.mouse.position.x - this.origin.x) / (this.origin.y - eventlib.mouse.position.y);
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
      this.bulletArray.push(new Bullet(this.origin.x, this.origin.y, this.direction));
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
  constructor(originx, originy, direction) {
    this.position = {x: originx, y: originy};
    this.direction = direction;
    this.color = 'rgb(' + MathC.RandomRange(50,100) + ',' + MathC.RandomRange(100,255) + ',' + MathC.RandomRange(200,255) + ')';
  }
  Physics() {
    this.position.y += -(Game.bulletVel) * (time.frame.delta / 100);
    this.position.x += (Game.bulletVel * this.direction) * (time.frame.delta / 100);
  }
  Draw() {
    canvas.content.fillStyle = this.color;
    canvas.content.beginPath();
    canvas.content.arc(this.position.x, this.position.y, 2, 0, MathC.TAU);
    canvas.content.closePath();
    canvas.content.fill();
  }
  OutofBounds() {
    return this.position.x > page.width || this.position.x < 0 || this.position.y < 0;
  }
}

class Laser {
  constructor(position) {
    this.origin = position;
    this.mouse = eventlib.mouse.position;
    this.ratio = (this.mouse.x - this.origin.x) / (this.origin.y - this.mouse.y);
    if(!!MathC.RandomRange(0,1)) {
      this.color = 'rgba(255, 0, 100, 0.2)';
    } else {
      this.color = 'rgba(0, 255, 100, 0.2)';
    }
  }
  Physics() {
    this.mouse = eventlib.mouse.position;
    this.ratio = (this.mouse.x - this.origin.x) / (this.origin.y - this.mouse.y);
  }
  Draw() {
    canvas.content.lineWidth = 2;
    canvas.content.strokeStyle = this.color;
    canvas.content.beginPath();
    canvas.content.moveTo(this.origin.x, this.origin.y);
    canvas.content.lineTo(this.origin.x + (this.origin.y * this.ratio), 0);
    canvas.content.closePath();
    canvas.content.stroke();
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
    this.color = 'rgb(' + this.rgb.r + ',' + this.rgb.g + ',' + this.rgb.b + ')';
    this.asteroidTrail = [];
  }
  Physics() {
    this.position.x += this.velocity.x * (time.frame.delta / 100);
    this.position.y += this.velocity.y * (time.frame.delta / 100);
    this.asteroidTrail.unshift(new AsteroidTrail(this.position.x, this.position.y, [this.rgb.r, this.rgb.g, this.rgb.b]));
    if(this.asteroidTrail.length > 100) {
      // remove all positions after 100 that exist
      this.asteroidTrail.splice(101, 1);
    }
    for(var n = 0; n < this.asteroidTrail.length; n++) {
      this.asteroidTrail[n].Physics();
    }
  }
  Draw() {
    for(var n = 0; n < this.asteroidTrail.length; n++) {
      this.asteroidTrail[n].Draw();
    }
    var halo = canvas.content.createRadialGradient(this.position.x, this.position.y, 5, this.position.x, this.position.y, 10);
    halo.addColorStop(0, this.color);
    halo.addColorStop(1, 'transparent');
    canvas.content.fillStyle = halo;
    canvas.content.beginPath();
    canvas.content.arc(this.position.x, this.position.y, 10, 0, MathC.TAU);
    canvas.content.closePath();
    canvas.content.fill();

    canvas.content.fillStyle = this.color;
    canvas.content.beginPath();
    canvas.content.arc(this.position.x, this.position.y, 5, 0, MathC.TAU);
    canvas.content.closePath();
    canvas.content.fill();
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
        if (Math.pow(this.position.x-Game.bulletArray[n][i].position.x, 2) + Math.pow(Game.bulletArray[n][i].position.y-this.position.y, 2) <= Math.pow(10+10, 2)) {
          return true; // else continue checking through array
        }
      }
    }
  }
}

class AsteroidTrail {
  constructor(positionx, positiony, astColor) {
    this.position = {x: positionx, y: positiony};
    this.rgb = {r: astColor[0], g: astColor[1], b: astColor[2]};
    this.transparency = 100;
  }

  Physics() {
    this.transparency--;
    this.color = 'rgba(' + this.rgb.r + ',' + this.rgb.g + ',' + this.rgb.b + ',' + (this.transparency / 100) / 10 + ')';

  }
  Draw() {
    var halo = canvas.content.createRadialGradient(this.position.x, this.position.y, 5, this.position.x, this.position.y, 25);
    halo.addColorStop(0, this.color);
    halo.addColorStop(1, 'transparent');
    canvas.content.fillStyle = halo;
    canvas.content.beginPath();
    canvas.content.arc(this.position.x, this.position.y, 30, 0, MathC.TAU);
    canvas.content.closePath();
    canvas.content.fill();
  }
}

class Scene {
  constructor() {
    this.background = new Square('000', 0, page.height);
    this.land = new Square('120', page.height - 100, page.height);
    this.stars = new StarSys();
  }
  Draw() {
    this.background.Draw();
    this.land.Draw();
    this.stars.Draw();
  }
}

class Square {
  constructor(color, start) {
    this.color = '#' + color;
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
    this.color = '#fff';
  }
  Draw() {
    canvas.content.fillStyle = this.color;
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
    canvas.content.fillText('Score: ' + (Game.finalScore * 10).toLocaleString(), page.width / 2, page.height * 0.8);
  }
}
