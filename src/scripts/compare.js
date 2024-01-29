let particles = [];
let particles2 = [];

let table, fontBold, fontRegular; // A tabela que armazenará os dados do CSV
let nomePais1, nomePais2, anoPais1, anoPais2;

function preload() {
    // Carregar dados dos países (arquivo CSV)
    table = loadTable('data/air-pollution.csv', 'csv', 'header');
    fontBold = loadFont('assets/fonts/Exo_2/static/Exo2-ExtraBold.ttf');
    fontRegular = loadFont('assets/fonts/Exo_2/static/Exo2-SemiBold.ttf');
    fontLight = loadFont('assets/fonts/Exo_2/static/Exo2-Regular.ttf');
}

function setup() {

    createCanvas(windowWidth, windowHeight, WEBGL);
  
    const urlSearchParams = new URLSearchParams(window.location.search);
    nomePais1 = urlSearchParams.get('p1');
    anoPais1 = urlSearchParams.get('a1');
    nomePais2 = urlSearchParams.get('p2');
    anoPais2 = urlSearchParams.get('a2');

    console.log(nomePais1, nomePais2, anoPais1, anoPais2)

    for (let n = 0; n < table.getRowCount(); n++) {
        let row = table.getRow(n);
        let country = row.getString('Ccode'); // Coluna correspondente a "Year" no dataset

        // Adiciona apenas as linhas onde o ano é igual ao selecionado
        if (country === nomePais1) {
            let year = row.getNum('Year');
            if(year == anoPais1){
                let countryName = row.getString('Country');
                let pollutionPCP = row.getNum('Meanpcp');
                let pollution = row.getNum('Mean');
                let deaths = row.getNum('Deaths');
    
                let r = polToPixel(pollutionPCP);
                let opacity = polToColor(pollution);
    
                let particle = new Particle(pollutionPCP, pollution, r, opacity, country, year, deaths);
                particle.setCountryName(countryName);
                particles.push(particle);
            }
        }   

        if (country === nomePais2) {
            let year = row.getNum('Year');
            if(year == anoPais2){
                let countryName = row.getString('Country');
                let pollutionPCP = row.getNum('Meanpcp');
                let pollution = row.getNum('Mean');
                let deaths = row.getNum('Deaths');

                let r = polToPixel(pollutionPCP);
                let opacity = polToColor(pollution);

                let particle2 = new Particle(pollutionPCP, pollution, r, opacity, country, year, deaths);
                particle2.setCountryName(countryName);
                particles2.push(particle2);
            }
        }   
    }
}
  
function draw() {
  background(0);
  translate(-width/2, -height/2);
  cursor(ARROW);

  fill(255,150)
  textSize(20)
  textFont(fontBold);
  text("Invisible Health Hazard", width/2, 35)

  fill(150);
  textFont(fontBold);
  textSize(16);
  textAlign(CENTER);
  text("Compare", width/2, 61); 

  fill(255,30)
  rect(width/2, 120, 0.5, height - 230);

    //ellipse(width/4, height/2, 400)
    textSize(10);

    for(let p of particles){
        p.setPos(width/4, height/2)
        p.show();
        p.update();
    }

    for(let p of particles2){
        p.setPos(width - width/4, height/2)
        p.show();
        p.update();
    }



    if(mouseHoverX(35, 30 , 20)){
        cursor('pointer');
        fill(255,150)
      }else{
        fill(255,40)
      }
      triangle(30, 30, 40, 25, 40, 35);

}


class Particle {
    constructor(polpcp, pol, r, opacity, country, year, deaths) {
      this.pol = pol;
      this.polpcp = polpcp
      this.r = r;
      this.opacity = opacity;
      this.country = country;
      this.year = year;
      this.deaths = deaths;

      if(this.deaths == 0) this.color = '#797979';
      else this.color = getColorForPollution(this.deaths);

      this.particle = [];
      this.history = [];

      this.initialized = false;
      this.currentIteration = 0;
      this.iterations = 600;
      //allParticles.push(this);
    }

    setCountryName(name) {
        this.countryName = name;
    }

    updateParticle(newR, newOpacity, newNextYearRadius, newNextYearOpacity){
        this.r = newR;
        this.opacity = newOpacity;
        this.nextYearRadius = newNextYearRadius;
        this.nextYearOpacity = newNextYearOpacity;
        this.color = getColorForPollution(this.opacity);
    }

    setPos(x,y) {
        this.x = x;
        this.y = y;

         if (!this.initialized) {
            this.initParticles();
            this.initialized = true;
        }
    }

    initParticles() {
        for (let i = 0; i < this.opacity; i++) {
          let ang = random(TWO_PI);
          let pos = createVector(this.x, this.y);
          let dir = createVector(cos(ang), sin(ang));
          this.particle[i] = new ParticleElement(pos, dir, this.r, this.color);
        }
      }

  
    show() {
      noStroke();
      fill(255, 200);
      textFont(fontBold);
      textSize(32);
      text(this.countryName, this.x, this.y - 250)
      textFont(fontRegular);
      textSize(18);
      text(this.year, this.x, this.y - 225);

      fill(255, 100);
      textFont(fontLight);
      textSize(11);

      textAlign(RIGHT)
      text("Emissions: ", this.x, this.y + 240);
      text("Emissions (Per capita): ", this.x, this.y + 255);
      text("Deaths: ", this.x, this.y + 270);

      fill(255, 200);
      textFont(fontRegular);
      textSize(12);

      textAlign(LEFT)
      text(formatarNumero(this.pol.toFixed(0)) + ' ton', this.x, this.y + 240);
      text(this.polpcp.toFixed(2) + ' kg', this.x, this.y + 255);
      fill(this.color);
      ellipse(this.x - 48, this.y + 267, 10,10)
      fill(255, 200);
      if(this.deaths == 0) text('N/A', this.x, this.y + 270);
      else text(formatarNumero(this.deaths.toFixed(0)), this.x, this.y + 270);

      textAlign(CENTER)
      
            /*stroke(this.color);
            strokeWeight(1);
            fill(red(this.color), green(this.color), blue(this.color),30);
            ellipse(this.x, this.y, this.r * 2);*/
            noStroke();
        
        
    }

    update() {
        if (this.currentIteration < this.iterations) {
        for (let i = 0; i < this.particle.length; i++) {
          this.particle[i].updateMe(this.x, this.y, this.r);
          this.particle[i].drawMe();
        }
        this.currentIteration++;
    }else{
        for (let i = 0; i < this.particle.length; i++) {
          this.particle[i].drawHistory();
        }
      }
      }
}

class ParticleElement {
    constructor(_pos, _dir, _r, _color) {
      this.pos = _pos;
      this.dir = _dir;
      this.r = _r;
      this.color = _color;
      this.history = [];
    }
  
    updateMe(x,y,r) {
      //let randomScale = 0.5;
      let randomScale = map(r, 100, 400, 1, 8.0);
      this.dir.x = -(this.pos.x - x) / 500 + random(-1.7, 1.7) * randomScale;
      this.dir.y = -(this.pos.y - y) / 500 + random(-1.7, 1.7) * randomScale;

      this.pos.add(this.dir);
      this.history.push(createVector(this.pos.x, this.pos.y));

      let distance = dist(this.pos.x, this.pos.y, x, y);
    if (distance > r) {
        this.pos = createVector(x, y);
    }
    }
  
    drawMe() {
      noStroke();
      fill(255, 10);

      ellipse(this.pos.x, this.pos.y, 0.7, 0.7);

      for (let i = 0; i < this.history.length; i++) {
        let prevPos = this.history[i];
        fill(255, 10);
        ellipse(prevPos.x, prevPos.y, 0.7, 0.7);
    }
  }

  drawHistory(){
    for (let i = 0; i < this.history.length; i++) {
      let prevPos = this.history[i];
      fill(255, 10);
      ellipse(prevPos.x, prevPos.y, 0.7, 0.7);
    }
  }
  }

function polToPixel(pol) {
    let size = map(pol, 0, 746, 100, 400);
    return size;
}

function polToColor(pol) {
  let opacity = map(pol, 0, 65200000, 1, 300);
  return opacity;
}

function getColorForPollution(pol) {
    // Mapeia a poluição para uma cor usando Chroma.js
    return chroma.scale(['#f2f2f2','#C2ECC8','#92E69F','#62DF75','#32d94b']).domain([0,500,10000,100000,1430000])(pol).hex(); //[10,34,57]
}//['#68b2f8','#506ee5','#7037cd','#651f71']
  
  // Chamar a função para exibir os detalhes do país ao carregar a página
  //window.onload = exibirDetalhesPais;
  
  function mouseHoverX(x,y,r){
    let distance = dist(mouseX, mouseY, x, y);
    return distance < r;
  }

  function mousePressed() {
    // Verificar se o mouse está sobre o botão de play/pause
    if (mouseHoverX(35, 30 , 20)){
        window.history.back();
    }
  }

  function formatarNumero(numero) {
    // Converte o número para uma string
    let numeroString = numero.toString();
    
    // Cria um array para armazenar os grupos de três dígitos
    let grupos = [];
    
    // Itera pela string do número de trás para frente, agrupando de três em três dígitos
    for (let i = numeroString.length; i > 0; i -= 3) {
      let grupo = numeroString.substring(max(i - 3, 0), i);
      grupos.unshift(grupo); // Adiciona o grupo no início do array
    }
    
    // Junta os grupos com espaços e retorna o resultado
    return grupos.join(' ');
  }