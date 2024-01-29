  let particleSystem;
  let count = 0;
  let colorStart, colorEnd;


let alpha = 0;
let fadeInDuration = 3000; // 2 segundos para a transição
  
  function preload() {
    // Carregar dados dos países (arquivo CSV)
    table = loadTable('data/air-pollution.csv', 'csv', 'header');
    fontBold = loadFont('assets/fonts/Exo_2/static/Exo2-ExtraBold.ttf');
    fontLight = loadFont('assets/fonts/Exo_2/static/Exo2-Light.ttf');
  }

  function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    background(0);

    particleSystem = new Particle();
    particleSystem.build();

    colorStart = color(33,33,33);
    colorEnd = color(255);
    noStroke();
  }
  
  function draw() {
    translate(-width / 2, -height / 2);
    particleSystem.update();
  
    let lerpedColor = lerpColor(colorStart, colorEnd, map(count, 0, 100, 0, 1));
  
    textAlign(CENTER);
  
    setTimeout(() => {
    // Transição suave para o texto "Invisible Health Hazard"
    if (count > 0 && count <= 100) {
      alpha = min(alpha + 1 / (60 * fadeInDuration / 3000), 1);
    }
  
    fill(255, 255, 255, alpha);
    textFont(fontBold);
    textSize(60);
    text("Invisible Health Hazard", width / 2, height / 2);
}, 3000);
  
    setTimeout(() => {
        fill(lerpedColor);
        textFont(fontLight);
    textSize(12);
        text("Click to Enter",width/2, height/2+20)

        if(mouseIsPressed) goToAnotherPage();
      }, 6000);

      count++;

      if (count > 150) {
        count = 0;
      }

      
  }

  // Função chamada ao clicar no canvas
function goToAnotherPage() {
    // Redireciona para outro HTML
    window.location.href = 'inviz.html';
  }

  class Particle {
    constructor() {
      this.particle = [];
      this.num = 20;
      this.r = 200;
      this.totalParticles = 0;
      this.maxParticles = 500;
    }
  
    build() {
      for (let i = 0; i < this.num; i++) {
        let ang = random(TWO_PI);
        let px = width / 2;
        let py = height / 2;
        let pos = createVector(px, py);
        let dir = createVector(cos(ang), sin(ang));
        this.particle.push(new ParticleElement(pos, dir));
        this.totalParticles++;
      }
    }
  
    update() {
      for (let i = 0; i < this.particle.length; i++) {
        this.particle[i].updateMe(this.r);
        this.particle[i].drawMe();
      }
  
      // Verifica se o número total de partículas excede o limite
      if (this.totalParticles > this.maxParticles) {
        let particlesToRemove = this.totalParticles - this.maxParticles;
        this.particle.splice(0, particlesToRemove);
        this.totalParticles = this.maxParticles;
      }
    }
  }
  
  class ParticleElement {
    constructor(_pos, _dir) {
      this.pos = _pos;
      this.dir = _dir;
    }
  
    updateMe(radius) {
      let randomScale = map(radius, 10, 50, 0.1, 1.0);
  
      this.dir.x =
        -(this.pos.x - width / 2) / 500 + random(-1.7, 1.7) * randomScale;
      this.dir.y =
        -(this.pos.y - height / 2) / 500 + random(-1.7, 1.7) * randomScale;
  
      this.pos.add(this.dir);
    }
  
    drawMe() {
      fill(255, random(10, 30));
      noStroke();
      ellipse(this.pos.x, this.pos.y, 1, 1);
    }
  }