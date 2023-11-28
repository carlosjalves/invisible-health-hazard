// Coding Train / Daniel Shiffman

const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;

const { GravityBehavior, AttractionBehavior2D } = toxi.physics2d.behaviors;

const { Vec2D, Rect } = toxi.geom;

let physics;

let particles = [];
let springs = [];

let table; // A tabela que armazenará os dados do CSV

let years = [];

let currentYear = 1890;
let interval = 3000; // Intervalo em milissegundos entre cada ano
let lastUpdateTime = 0;


function preload() {
    // Carregar dados dos países (arquivo CSV)
    table = loadTable('data/air-pollution.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  physics = new VerletPhysics2D();

  let bounds = new Rect(0, 0, width, height);
  physics.setWorldBounds(bounds);
  }

function draw() {
  background(255);

  physics.update();
  updateParticles();
  //if (selectedYear) {
    for (let p of particles) {
        //if (p.year === selectedYear) {
            //p.display();
            //p.update();
            p.show();
        //}
    }   
   /* for (let spring of springs) {
        spring.show();
    }*/
//}  
}

function updateParticles() {

  if (millis() - lastUpdateTime > interval) {
    particles = []; // Limpa o array de partículas
  
    for (let n = 0; n < table.getRowCount(); n++) {
      let row = table.getRow(n);
      let ano = row.getNum('Year'); // Coluna correspondente a "Year" no dataset
  
      // Adiciona apenas as linhas onde o ano é igual ao selecionado
      if (ano === currentYear) {
        let latitude = row.getNum('Latitude'); // Substitua 'latitude' pelo nome da coluna correspondente em seu CSV
        let longitude = row.getNum('Longitude'); // Substitua 'longitude' pelo nome da coluna correspondente em seu CSV
        let countryName = row.getString('Country'); // Substitua 'country' pelo nome correto da coluna no seu CSV
        let pollutionPCP = row.getNum('Meanpcp');
        let pollution = row.getNum('Mean');
        let pos = latLngToPixel(latitude, longitude);
        let r = polToPixel(pollutionPCP);
        let opacity = polToColor(pollution);

        //if (ano2 === currentYear+10){
        let nextYearRow = table.getRow(n+10);
        let nextYearPollutionPCP = nextYearRow.getNum('Meanpcp');
        let nextYearR = polToPixel(nextYearPollutionPCP);
        let nextYearPollution = nextYearRow.getNum('Mean');
        let nextYearOpacity = polToColor(nextYearPollution); 

        let particle = new Particle(pos.x, pos.y, r, opacity, nextYearR, nextYearOpacity);
        particle.setCountryName(countryName);
        particles.push(particle);
   //}
    }
        
        
      
    }

    lastUpdateTime = millis();
    currentYear+=10;

  }

    fill(0);
    text(currentYear, 10, 10);
    

    if(currentYear == 2010){
      currentYear = 1890;
    }
  
  for (let particle of particles) {
    particle.checkParticlesCollision()
    particle.update();
  }
}

class Particle extends VerletParticle2D {
    constructor(x, y, r, opacity, nextYearRadius, nextYearOpacity) {
      super(x, y);
      this.r = r;
      this.nextYearRadius = nextYearRadius;
      this.opacity = opacity;
      this.nextYearOpacity = nextYearOpacity;
      this.speed = 0.01; // Ajuste conforme necessário

      //this.target = new toxi.physics2d.VerletParticle2D(new toxi.geom.Vec2D(x, y));
      //this.attractionBehavior = new toxi.physics2d.behaviors.AttractionBehavior(this.target, 1500, 0.002, 0.01);
      //physics.addParticle(this.target);
      //physics.addBehavior(this.attractionBehavior);
      physics.addParticle(this);
    }

    update() {
      // Interpolação suave para o tamanho da partícula
      this.r = lerp(this.r, this.nextYearRadius, this.speed);
      this.opacity = lerp(this.opacity, this.nextYearOpacity, this.speed);
    }

    checkParticlesCollision() {
      for (let other of particles) {
        if (other !== this) {
          let distance = dist(this.x, this.y, other.x, other.y);
          let minDistance = this.r + other.r; // Soma dos raios das partículas
    
          if (distance < minDistance) {
            let angle = atan2(other.y - this.y, other.x - this.x);
            let overlap = minDistance - distance;
    
            // Calcular o novo posicionamento das partículas
            let newX = this.x - cos(angle) * overlap / 2;
            let newY = this.y - sin(angle) * overlap / 2;
            let otherX = other.x + cos(angle) * overlap / 2;
            let otherY = other.y + sin(angle) * overlap / 2;
    
            // Atualizar as posições das partículas
            this.x = newX;
            this.y = newY;
            other.x = otherX;
            other.y = otherY;
          }
        }
      }
    }

    setCountryName(name) {
      this.countryName = name;
    }
  
    isMouseOver() {
      let distance = dist(mouseX, mouseY, this.x, this.y);
      return distance < this.r;
    }
  
    displayCountryName() {
      if (this.isMouseOver()) {
        fill(255,0,0);
        noStroke();
        textAlign(CENTER);
        textSize(12);
        text(this.countryName, this.x, this.y - this.r - 5);

        if(mouseIsPressed){
          let urlPaginaIndividual = "country.html?p=" + encodeURIComponent(this.countryName);
          window.location.href = urlPaginaIndividual;
        }
      }
    }
  
    show() {
      noStroke();
      fill(0, this.opacity);
      this.displayCountryName();
      ellipse(this.x, this.y, this.r * 2);
    }


/*
    display() {
        beginShape();
        vertex(particle.x1, particle.y1);
        endShape(CLOSE);
    }*/
}
  
/*
class Spring extends VerletSpring2D {
    constructor(a, b, strength) {
      let length = dist(a.x, a.y, b.x, b.y);
      super(a, b, length, strength);
      physics.addSpring(this);
    }
  
    show() {
      stroke(0, 50);
      line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
  }*/
  

  function latLngToPixel(lat, lng) {
    let x = map(lng, -180, 180, 20, width - 20);
    let y = map(lat, 90, -90, 20, height - 20);
    return createVector(x, y);
}

function polToPixel(pol) {
    let size = map(pol, 0, 380, 10, 100);
    return size;
}

function polToColor(pol) {
  let opacity = map(pol, 0, 37700000, 30, 255);
  return opacity;
}