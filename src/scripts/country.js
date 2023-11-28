
let particles = [];
let particlesByYear = {}; // Objeto para armazenar as partículas por ano

let gridX = [];
let gridY = [];

let table, fontBold; // A tabela que armazenará os dados do CSV
let nomePais;

function preload() {
    // Carregar dados dos países (arquivo CSV)
    table = loadTable('data/air-pollution.csv', 'csv', 'header');
    fontBold = loadFont('assets/Exo_2/static/Exo2-ExtraBold.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    colorMode(HSB, 360, 100, 100, 100);
    pixelDensity(2);
    blendMode(ADD);
  
    nomePais = obterParametroDaURL('p');
    console.log(nomePais);

    for (let n = 0; n < table.getRowCount(); n++) {
        let row = table.getRow(n);
        let country = row.getString('Country'); // Coluna correspondente a "Year" no dataset
        // Adiciona apenas as linhas onde o ano é igual ao selecionado
        if (country === nomePais) {
            let year = row.getNum('Year');
            if (year % 10 === 0 || year === 2019) { // Adiciona apenas anos múltiplos de 10
                if (!particlesByYear[year]) {
          //let countryName = row.getString('Country'); // Substitua 'country' pelo nome correto da coluna no seu CSV
          let pollutionPCP = row.getNum('Meanpcp');
          let pollution = row.getNum('Mean');

          let r = polToPixel(pollutionPCP);
          let opacity = polToColor(pollution);

          let particle = new Particle(r, opacity, year);
          particles.push(particle);
      
                }
        }
    }
          
        
      }
      console.log(particles)
      
}
  
function draw() {
    background(0);

    textSize(38);
    textAlign(CENTER);
    textFont(fontBold);
    text(nomePais, width/2, 80);

    textSize(12);

    let cols = 7;
    let rows = 4;
    let cellWidth = width / cols - 40;
    let cellHeight = height / rows - 60;

    for (let i = 0; i < particles.length; i++) {
        let particle = particles[i];
        let colIndex = i % cols;
        let rowIndex = floor(i / cols);
        let x = colIndex * cellWidth + cellWidth / 2 + 140;
        let y = rowIndex * cellHeight + cellHeight / 2 + 120;
        particle.setPos(x,y);
        particle.update();
    }


}


class Particle {
    constructor(r, opacity, year) {
      this.r = r;
      this.opacity = opacity;
      this.year = year;

      this.particle = [];
      //this.num = 100;

      //this.initParticles();

      this.initialized = false;


    }

    setPos(x,y) {
        this.x = x;
        this.y = y;

         // Chame initParticles() apenas se ainda não foi chamado
         if (!this.initialized) {
            this.initParticles();
            this.initialized = true;
        }

    }

    initParticles() {
        for (let i = 0; i < this.opacity; i++) {
          let theta = random(PI * 2);
          let ang = random(TWO_PI);
          let px = this.x + this.r * cos(ang);
          let py = this.y + this.r * sin(ang);
          let pos = createVector(px, py);
          let dir = createVector(cos(ang), sin(ang));
          this.particle[i] = new ParticleElement(pos, dir);
        }
      }

  /*
    show(posx, posy) {
      noStroke();
      fill(0, this.opacity);
      ellipse(posx, posy, this.r * 2);
      text(this.year, posx, posy);
    }*/

    update() {
        for (let i = 0; i < this.particle.length; i++) {
            
          this.particle[i].updateMe(this.x, this.y, this.r);
          this.particle[i].drawMe();
        }
      }
}

class ParticleElement {
    constructor(_pos, _dir) {
      this.pos = _pos;
      this.dir = _dir;
    }
  
    updateMe(x,y,r) {
        let randomScale = map(r, 10, 50, 0.1, 1.0);

      this.dir.x = -(this.pos.x - x) / 500 + random(-1.7, 1.7) * randomScale;
      this.dir.y = -(this.pos.y - y) / 500 + random(-1.7, 1.7) * randomScale;
      this.pos.add(this.dir);
    }
  
    drawMe() {
      fill(360, 0, 100, random(10, 60));
      ellipse(this.pos.x, this.pos.y, 0.7, 0.7);
    }
  }

function polToPixel(pol) {
    let size = map(pol, 0, 380, 10, 50);
    return size;
}

function polToColor(pol) {
  let opacity = map(pol, 0, 37700000, 1, 100);
  return opacity;
}

function obterParametroDaURL(nome) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get(nome);
}

  
  // Chamar a função para exibir os detalhes do país ao carregar a página
  //window.onload = exibirDetalhesPais;
  