let particles = [];
let tparticles = [];
let tparticles2 = [];
let years = [];
let selectedYear; // Variável para armazenar o ano selecionado

let drawHistory = false;

let table, fontBold, fontRegular; // A tabela que armazenará os dados do CSV
//let years = [];
//let currentYear = 1890;
//let interval = 3000; // Intervalo em milissegundos entre cada ano
//let lastUpdateTime = 0;
let currentYear = 1800;
let interval = 3000; // Intervalo em milissegundos entre cada ano
let lastUpdateTime = 0;
let yearSlider;
let playButton;
let isPlaying = false;
let autoUpdateInterval;
let initCountry = "Portugal"
let country1 = "0";
let country2 = "0";
let reset = false;
let reset2 = false;
let resetParticles = false;
let resetInitParticles = false;
let mouseClickedFlag = false;
let mouseClickedFlag2 = false;
let isSelected = false;
let previousYear;
let pollutionMax = {};
let splice = false;
let firstIteration = false;
let selectedEllipseIndex = -1; // Inicializa o índice da elipse selecionada
let selectedTimelineEllipseIndex = -1;
let selectedTimelineEllipseIndex2 = -1;
let edge = false;
let legend = false;
let isTimelineSelected = false;
let isTimelineSelected2 = false;
let compare = false;

let anoInit = -1;

let legend_div;
p5.disableFriendlyErrors = true;


function preload() {
  // Carregar dados dos países (arquivo CSV)
  table = loadTable('data/air-pollution.csv', 'csv', 'header');
  fontBold = loadFont('assets/fonts/Exo_2/static/Exo2-ExtraBold.ttf');
  fontRegular = loadFont('assets/fonts/Exo_2/static/Exo2-SemiBold.ttf');
  fontLight = loadFont('assets/fonts/Exo_2/static/Exo2-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  //document.addEventListener('contextmenu', event => event.preventDefault());

  legend_div = select("#legend");
  legend_div.style("display", "none");
 

  for (let n = 0; n < table.getRowCount(); n++) {
    let row = table.getRow(n);
    let ano = row.getNum('Year'); // Coluna correspondente a "Year" no dataset
    let country = row.getString('Country');

    // Adiciona apenas as linhas onde o ano é igual ao selecionado
    if (ano === currentYear) {
      let countryName = row.getString('Country');
      let latitude = row.getNum('Latitude'); // Substitua 'latitude' pelo nome da coluna correspondente em seu CSV
      let longitude = row.getNum('Longitude'); // Substitua 'longitude' pelo nome da coluna correspondente em seu CSV
      let pos = latLngToPixel(latitude, longitude);
      let pollutionPCP = row.getNum('Meanpcp');
      let pollution = row.getNum('Mean');
      let r = polToPixel(pollutionPCP);
      let opacity = polToColor(pollution);
      let deaths = row.getNum('Deaths');

      let nextYearRow = table.getRow(n + 10);
      let nextYearPollutionPCP = nextYearRow.getNum('Meanpcp');
      let nextYearR = polToPixel(nextYearPollutionPCP);
      let nextYearPollution = nextYearRow.getNum('Mean');
      let nextYearOpacity = polToColor(nextYearPollution);
      let nextYearDeaths = nextYearRow.getNum('Deaths')

      let particle = new Particle(pos.x, pos.y+70, r, opacity, nextYearR, nextYearOpacity, deaths, nextYearDeaths, pollution, pollutionPCP);
      particle.setCountryName(countryName);
      particles.push(particle);
    }

    if (country === initCountry) {
        let year = row.getNum('Year');
        if ((year % 10 === 0 && year > 1790)) { // Adiciona apenas anos múltiplos de 10
          //let countryName = row.getString('Country'); // Substitua 'country' pelo nome correto da coluna no seu CSV
          let pollutionPCP = row.getNum('Meanpcp');
          let pollution = row.getNum('Mean');
          let countryCode = row.getString('Ccode');
          let deaths = row.getNum('Deaths')

          let r = polToTimeline(pollutionPCP);
          let opacity = polToColor(pollution);

          let particle = new TimelineParticle(r, opacity, year, countryCode, deaths);
          tparticles.push(particle);
        }
    }
    if (country === initCountry) {
      let year = row.getNum('Year');
      if ((year % 10 === 0 && year > 1790)) { // Adiciona apenas anos múltiplos de 10
        //let countryName = row.getString('Country'); // Substitua 'country' pelo nome correto da coluna no seu CSV
        let pollutionPCP = row.getNum('Meanpcp');
        let pollution = row.getNum('Mean');
        let countryCode = row.getString('Ccode');
        let deaths = row.getNum('Deaths')

        let r = polToTimeline(pollutionPCP);
        let opacity = polToColor(pollution);

        let particle = new TimelineParticle(r, opacity, year, countryCode, deaths);
        tparticles2.push(particle);
      }
  }

  }
  //console.log(pollutionMax['Afghanistan']);
  yearSlider = createSlider(1800, 2020);
  yearSlider.position(80, height - 40);
  yearSlider.style('width', width-80-40+"px");

  yearSlider.class('mySlider');

  // Criar botão de play/pause
  playButton = createButton("play");
  playButton.class('play');
  playButton.position(30, height - 40);
  playButton.mousePressed(togglePlay);

}

function draw() {
  //clear();
  background(0);

  translate(-width/2, -height/2);
  cursor(ARROW);

  currentYear = yearSlider.value();

  fill(255,150)
  textSize(20)
  textFont(fontBold);
  text("Invisible Health Hazard", width/2, 35)

  fill(255);
  textFont(fontBold);
  textSize(16);
  textAlign(CENTER);
  text(currentYear, width/2+50, 61); 

  fill(255,150);
  textFont(fontRegular);
  textSize(14);
  textAlign(CENTER);
  text("Current Year: ", width/2-20, 60); 

  if(mouseHoverX(width-40, 35,15)){
    cursor('pointer');
    stroke(255,150);
    noFill();
    ellipse(width-40, 35, 15, 15);
    fill(255,150)
    textSize(10);
    text('Project info', width-80, 38)
  }else{
    stroke(255,40);
    noFill();
    ellipse(width-40, 35, 15, 15);
    fill(255,40)
  }

  noStroke();
  textSize(10);
  text('i',width-40, 38)
  fill(255,150);

  if(mouseHoverX(40, 35,15)){
    cursor('pointer');
    stroke(255,150);
    noFill();
    rect(40-6.5, 35-6.5, 13, 13);
    fill(255,150)
    text('Legend', 70, 38)
  }else{
    stroke(255,40);
    noFill();
    rect(40-6.5, 35-6.5, 13, 13);
    fill(255,40)
  }

  noStroke();
  rect(36, 35-4, 2, 2)
  rect(39, 35-3, 5, 0.5)

  rect(36, 35-1, 2, 2)
  rect(39, 35, 5, 0.5)

  rect(36, 35+2, 2, 2)
  rect(39, 35+3, 5, 0.5)
  fill(255,150);


  //let legend_div = select("#legend");
  //legend_div.style("display", "none");
  if(!legend){
    legend_div.style("display", "none");
  }else{
    legend_div.style("display", "block");
  }
  
  


  if(!edge){
    stroke(255,50);
    noFill();
    if(mouseHoverX(width-132, 100-3,15)){
      cursor('pointer');
      stroke(255,150);
    }
    ellipse(width-132, 100-3, 15, 15);
    //line(width-140, 90, width-125, 105);
  }else{
    stroke(255,150);
    noFill();
    if(mouseHoverX(width-132, 100-3,15)){
      cursor('pointer');
      stroke(255,50)
    }
    ellipse(width-132, 100-3, 15, 15);
  }
  
    
    //ellipse(width-132, 100-3, 15, 15);
    //line(width-140, 90, width-125, 105);
  /*}else{
    stroke(255,50);
    noFill();
    ellipse(width-132, 100-3, 15, 15);
    line(width-140, 90, width-125, 105);
  }*/

  fill(255,150);
  text('Edge visibility', width-85, 100)
  noStroke();

  //console.log(edge);

  //noFill();
  //ellipse(width-132, 100-3, 15, 15);
  //line(width-140, 90, width-125, 105);


  //console.log(currentYear)

  for (let i = 1800; i <= 2020; i += 10) {
    let x = map(i, 1800, 2020, 80, width-56);
    if(mouseY > height-140){
      fill(255,150);
    }else{
      fill(255,30);
    }


    rect(x+10,height-36, 1,5)
    textFont(fontRegular);
    textSize(10);
    textAlign(CENTER);
    text(i,x+10, height-42)
  }

  updateParticles();

    for (let p of particles) {
            p.checkParticlesCollision();   
            p.updateEllipse();
            p.show();
            p.update();
    }

    if (currentYear % 10 === 0 && currentYear > 1809 && anoInit != currentYear) {
      resetParticles = true;
      firstIteration = false;
      anoInit = currentYear;
    }

    if(currentYear === 1800 && anoInit != -1 && anoInit != currentYear){
      firstIteration = true;
      anoInit = currentYear;
    }

    if(firstIteration){
      for(let p of particles){
        p.restartInitParticles();
      }
      firstIteration = false;
    }

    if(resetParticles){
      for(let p of particles){
          p.reset();
          p.setParticles();
      }
      resetParticles = false;
  }
/*
      // Verificar se o ano mudou
      console.log(currentYear%10);
  if (currentYear % 10 === 0) {
    // Inicializar as partículas com base no novo ano
    for (let p of particles) {
      p.initParticles();
    }
  }*/


    if(country1!="0"){
        updateLineParticles(country1, tparticles);
        
        if(!reset){
            for(let p of tparticles){
                p.reset();
            }
            reset = true;
        }

        let cols = 24;
        let rows = 1;

        /*fill(255);
        textSize(10);
        textAlign(CENTER);
        text(country1, 40, height-75)*/
        tparticles[1].showCountryCode(75);

        if(mouseHoverX(25, height-85,10)){
          cursor('pointer');
          stroke(255,150);
          noFill();
          ellipse(25, height-85, 10, 10);
          fill(255,150)
        }else{
          stroke(255,40);
          noFill();
          ellipse(25, height-85, 10, 10);
          fill(255,40)
        }

        noStroke();
        textSize(10);
        text('x',25, height-83)
        fill(255,150);
      
        
        

        for (let i = 0; i < tparticles.length; i++) {
            let particle = tparticles[i];
            let colIndex = i % cols;
            let x = map(colIndex, 0, 23, 90, width+12);
            let y = height - 80;

            particle.setPos(x,y);
            particle.update();
            particle.show();
        }
    }else{
        reset = false;
    }

    if(country2!="0"){
      updateLineParticles(country2, tparticles2);
      
      if(!reset2){
          for(let p of tparticles2){
              p.reset();
          }
          reset2 = true;
      }

      let cols = 24;
      let rows = 1;

      tparticles2[1].showCountryCode(110);

      if(mouseHoverX(25, height-120,10)){
        cursor('pointer');
        stroke(255,150);
        noFill();
        ellipse(25, height-120, 10, 10);
        fill(255,150)
      }else{
        stroke(255,40);
        noFill();
        ellipse(25, height-120, 10, 10);
        fill(255,40)
      }

      noStroke();
      textSize(10);
      text('x',25, height-118)
      fill(255,150);

      for (let i = 0; i < tparticles2.length; i++) {
          let p = tparticles2[i];
          let colIndex = i % cols;
          let x = map(colIndex, 0, 23, 90, width+12);
          let y = height - 120;

          p.setPos(x,y);
          p.update();
          p.show();
      }
  }else{
      reset2 = false;
  }

  if(compare){
    fill(255,150);
    text("Compare", width/2, height-150)
    rect(width/2-20, height-146, 40,1)
  }

  if(country1 != '0' && country2 != '0'){
    fill(255,80);
    text("Select 2 to compare", 80, height-150)
  }


}

function updateParticles() {
  if (isPlaying) {
    updateParticlesAutomatically();
  } else {
    updateParticlesManually();
  }
}

function updateParticlesAutomatically() {
  if (millis() - lastUpdateTime > interval) {
  for (let n = 0; n < table.getRowCount(); n++) {
    let row = table.getRow(n);
    let ano = row.getNum('Year');

    if (ano >= 1800 && ano <= 2020 && ano % 10 === 0 && ano === currentYear) {
      let pollutionPCP = row.getNum('Meanpcp');
      let pollution = row.getNum('Mean');
      let r = polToPixel(pollutionPCP);
      let opacity = polToColor(pollution);
      let deaths = row.getNum('Deaths')

      let nextYearR, nextYearOpacity, nextYearDeaths;
      if(currentYear <= 2010){
      let nextYearRow = table.getRow(n + 10);
      let nextYearPollutionPCP = nextYearRow.getNum('Meanpcp');
      nextYearR = polToPixel(nextYearPollutionPCP);
      let nextYearPollution = nextYearRow.getNum('Mean');
      nextYearOpacity = polToColor(nextYearPollution);
      nextYearDeaths = nextYearRow.getNum('Deaths')
    }

      if (anoInit != -1) {
        // Iterar sobre as partículas e associar os valores apenas à partícula correta
        for (let i = 0; i < particles.length; i++) {
          let p = particles[i];
          let countryName = row.getString('Country');
          if (p.countryName === countryName) {
            if (currentYear != 2020){
              p.updateParticle(r, opacity, nextYearR, nextYearOpacity, deaths, nextYearDeaths, pollution, pollutionPCP);
              
            } else p.updateParticle(r, opacity, r, opacity, deaths, deaths, pollution, pollutionPCP);
          }
        }
      }
    }
  }
  lastUpdateTime = millis();
  }
  if (currentYear === 2020) {
    currentYear = 2020;
  }
}

function updateParticlesManually() {
  // Update manual (movendo o slider)
  for (let n = 0; n < table.getRowCount(); n++) {
    let row = table.getRow(n);
    let ano = row.getNum('Year');

    if (ano === currentYear && ano % 10 === 0 && ano > 1790) {
      let pollutionPCP = row.getNum('Meanpcp');
      let pollution = row.getNum('Mean');
      let r = polToPixel(pollutionPCP);
      let opacity = polToColor(pollution);
      let deaths = row.getNum('Deaths')

      let nextYearR, nextYearOpacity, nextYearDeaths;
      if (ano != 2020){
        let nextYearRow = table.getRow(n + 9);
        let nextYearPollutionPCP = nextYearRow.getNum('Meanpcp');
        nextYearR = polToPixel(nextYearPollutionPCP);
        let nextYearPollution = nextYearRow.getNum('Mean');
        nextYearOpacity = polToColor(nextYearPollution);
        nextYearDeaths = nextYearRow.getNum('Deaths')
      }

      if (anoInit != -1) {
        // Iterar sobre as partículas e associar os valores apenas à partícula correta
        for (let i = 0; i < particles.length; i++) {
          let p = particles[i];
          let countryName = row.getString('Country');
          if (p.countryName === countryName) {
            if(ano != 2020) p.updateParticle(r, opacity, nextYearR, nextYearOpacity, deaths, nextYearDeaths, pollution, pollutionPCP);
            else p.updateParticle(r, opacity, r, opacity, deaths, deaths, pollution, pollutionPCP);
          }
        }
      }
    }
  }
}

function updateLineParticles(newCountry, newParticles){
    for (let n = 0; n < table.getRowCount(); n++) {
        let row = table.getRow(n);
        let country = row.getString('Country'); // Coluna correspondente a "Year" no dataset
        // Adiciona apenas as linhas onde o ano é igual ao selecionado
        if (country === newCountry) {
            let year = row.getNum('Year');
            if (year % 10 === 0 && year > 1790) { // Adiciona apenas anos múltiplos de 10
                
          //let countryName = row.getString('Country'); // Substitua 'country' pelo nome correto da coluna no seu CSV
          let pollutionPCP = row.getNum('Meanpcp');
          let pollution = row.getNum('Mean');
          let countryCode = row.getString('Ccode');
          let deaths = row.getNum('Deaths');

          let r = polToTimeline(pollutionPCP);
          let opacity = polToColor(pollution);

          for (let i = 0; i < newParticles.length; i++) {
            let p = newParticles[i];
            if (p.year === year) {
                p.updateParticle(r, opacity, countryCode, deaths);
            }
          }     
        }
    }
          
        
      }
}

class Particle {
  constructor(x, y, r, opacity,nextYearRadius,nextYearOpacity, deaths, nextYearDeaths, pollution, pollutionPCP) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.opacity = opacity;
    this.nextYearRadius = nextYearRadius;
    this.nextYearOpacity = nextYearOpacity;

    this.deaths = deaths;
    this.nextYearDeaths = nextYearDeaths;

    this.pollution = pollution;
    this.pollutionPCP = pollutionPCP;
   
    if(this.deaths == 0) this.color = '#797979';
    else this.color = getColorForPollution(this.deaths);

    this.speed = 0.03;

    this.particle = [];
    this.history = [];

    this.currentIteration = 0;

    //if(!firstIteration) this.iterations = 5;
    this.iterations = 50;

    this.initialized = false;
    this.initInitialized = false;
    this.initParticles();
  }

  updateParticle(newR, newOpacity, newNextYearRadius, newNextYearOpacity, newDeaths, newNextYearDeaths, newPollution, newPollutionPCP){
    this.r = newR;
    this.opacity = newOpacity;
    this.nextYearRadius = newNextYearRadius;
    this.nextYearOpacity = newNextYearOpacity;

    this.deaths = newDeaths;
    this.nextYearDeaths = newNextYearDeaths;

    if(this.deaths == 0) this.color = '#797979';
    else this.color = getColorForPollution(this.deaths);

    this.pollution = newPollution;
    this.pollutionPCP = newPollutionPCP;
  }

  updateEllipse() {
    // Interpolação suave para o tamanho da partícula
    this.r = lerp(this.r, this.nextYearRadius, this.speed);
    this.opacity = lerp(this.opacity, this.nextYearOpacity, this.speed);
    if(this.deaths == 0) this.color = '#797979';
    else this.color = getColorForPollution(this.deaths);
  }

  checkParticlesCollision() {
    //this.updateEllipse();
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

resetInit(){
  this.particle = [];
  this.history = [];
  this.initInitialized = false;
  this.currentIteration = 0;
  this.iterations = 50;
}  

setInitParticles() {
  if (!this.initInitialized) {
      this.initParticles();
      this.initInitialized = true;
  }
}

restartInitParticles() {
  this.resetInit();
  this.setInitParticles();
}

reset(){
    this.initialized = false;
    this.currentIteration = 0;
    this.iterations = 8;
}

setParticles() {
    if (!this.initialized) {
        this.updateInitParticles();
        this.initialized = true;
    }
}

  initParticles() {
      for (let i = 0; i < this.opacity; i++) {
        let ang = random(TWO_PI);
        let pos = createVector(this.x, this.y);
        let dir = createVector(cos(ang), sin(ang));
        this.particle[i] = new ParticleElement(pos, dir, this.r, this.color, this.opacity);
      }

      this.previousOpacity = this.opacity;
    }

    updateInitParticles(){
      if(this.opacity>=this.previousOpacity){
        for (let i = this.particle.length; i < (this.opacity); i++) {
          let ang = random(TWO_PI);
          let pos = createVector(this.x, this.y);
          let dir = createVector(cos(ang), sin(ang));
          this.particle.push(new ParticleElement(pos, dir, this.r, this.color, this.opacity));
        }
      }
     else if(this.previousOpacity - this.opacity <= 1 && this.previousOpacity - this.opacity > 0){
        
      }else{
        for (let i = this.particle.length; i > this.opacity; i--) {
          this.particle.pop();
        }
      }

      this.previousOpacity = this.opacity;
    }

    isMouseOver() {
      let distance = dist(mouseX, mouseY, this.x, this.y);
      return distance < this.r;
    }

  show() {
    if(country1 === this.countryName){
      stroke(this.color);
      strokeWeight(1);
      fill(red(this.color), green(this.color), blue(this.color), 80);
      ellipse(this.x, this.y, this.r * 2);
      noStroke();
      textFont(fontRegular);
      textSize(12);
      fill(this.color);
      text(this.countryName, this.x, this.y - this.r - 10);
    }

    if(country2 === this.countryName){
      stroke(this.color);
      strokeWeight(1);
      fill(red(this.color), green(this.color), blue(this.color), 80);
      ellipse(this.x, this.y, this.r * 2);
      noStroke();
      textFont(fontRegular);
      textSize(12);
      fill(this.color)
      text(this.countryName, this.x, this.y - this.r - 10);
    }

    //let color = getColorForPollution(this.opacity);
    if (this.isMouseOver()) {
      cursor('pointer');
      fill(this.color);
      noStroke();
      textAlign(CENTER);
      textFont(fontRegular);
      textSize(12);
      text(this.countryName, this.x, this.y - this.r - 10);

      fill(255, 100);
      textFont(fontLight);
      textSize(10);

      textAlign(RIGHT)
      text("Emissions: ", this.x, this.y + this.r + 20);
      text("Emissions (Per capita): ", this.x, this.y + this.r + 35);
      text("Deaths: ", this.x, this.y + this.r + 50);
      fill(255, 200);
      textFont(fontRegular);
      textSize(11);

      textAlign(LEFT)
      text(formatarNumero(this.pollution.toFixed(0)) + ' ton', this.x, this.y + this.r + 20);
      text(this.pollutionPCP.toFixed(2) + ' kg', this.x, this.y + this.r + 35);

      if(this.deaths == 0) text('N/A', this.x, this.y + this.r + 50);
      else text(formatarNumero(this.deaths.toFixed(0)), this.x, this.y + this.r + 50);

      textAlign(CENTER);

      stroke(this.color);
      strokeWeight(1);
      fill(red(this.color), green(this.color), blue(this.color), 60);
      ellipse(this.x, this.y, this.r * 2);
      noStroke();

      if (mouseClickedFlag) {
        if (country1 === this.countryName) {
          country1 = "0";
        } else {
          reset = false;
          country1 = this.countryName;
        }
        mouseClickedFlag = false; // Redefine a flag para o próximo clique
      }

      if (mouseClickedFlag2) {
        if (country2 === this.countryName) {
          country2 = "0";
        } else {
          reset2 = false;
          country2 = this.countryName;
        }
        mouseClickedFlag2 = false; // Redefine a flag para o próximo clique
      }

    }
    else if(edge){
        stroke(red(this.color), green(this.color), blue(this.color), 100);
        //stroke(30);
        strokeWeight(1);
        //fill(255,10);
        fill(red(this.color), green(this.color), blue(this.color), 0);
        ellipse(this.x, this.y, this.r * 2);
        noStroke(); 
        
    }
    

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
  constructor(_pos, _dir, _r, _color, _opacity) {
    this.pos = _pos;
    this.dir = _dir;
    this.r = _r;
    this.color = _color;
    this.opacity = map(_opacity,0,20,5,50);
    this.history = [];
  }

  updateMe(x,y,r) {
    let randomScale = 1;
    this.dir.x = -(this.pos.x - x) / 500 + random(-1.7, 1.7) * randomScale;
    this.dir.y = -(this.pos.y - y) / 500 + random(-1.7, 1.7) * randomScale;

    this.pos.add(this.dir);
    this.history.push(createVector(this.pos.x, this.pos.y));
  }

  drawMe() {
    noStroke();
    fill(255, this.opacity);

    ellipse(this.pos.x, this.pos.y, 1, 1);

      for (let i = 0; i < min(this.history.length, 300); i++) {
        let prevPos = this.history[i];
        fill(255, this.opacity);
        ellipse(prevPos.x, prevPos.y, 1, 1);
      }
    
  }

  drawHistory(){
    for (let i = 0; i < this.history.length; i++) {
      let prevPos = this.history[i];
      fill(255, this.opacity);
      ellipse(prevPos.x, prevPos.y, 1, 1);
    }
  }

  /*spliceHistory(op){
    for (let i = op; i < this.history.length; i++) {
      console.log(op, this.history.length)
      this.history.pop()
    }
  }*/
}

class TimelineParticle {
    constructor(r, opacity, year, countryCode, deaths) {
      this.r = r;
      this.opacity = opacity;
      this.deaths = deaths;
      if(this.deaths == 0) this.color = '#797979';
      else this.color = getColorForPollution(this.deaths);
      this.year = year;
      this.countryCode = countryCode;

      this.particle = [];
      this.history = [];

      this.initialized = false;
      //allParticles.push(this);
      this.iterations = 100; // Defina o número desejado de iterações
      this.currentIteration = 0;
    }

    updateParticle(r, opacity, countryCode, deaths){
        this.r = r;
        this.opacity = opacity;
        this.deaths = deaths;
        this.countryCode = countryCode;
    }

    reset(){
        this.particle = [];
        this.history = [];
        this.initialized = false;
        this.currentIteration = 0;
    }

    setPos(x,y) {
        this.x = x;
        this.y = y;

        if (!this.initialized) {
            this.initParticles();
            this.initialized = true;
        }
    }

    showCountryCode(yy){
        fill(255);
        textSize(10);
        textAlign(CENTER);
        text(this.countryCode, 40, height-yy)
    }

    initParticles() {
        for (let i = 0; i < this.opacity; i++) {
          let ang = random(TWO_PI);
          let px = this.x;
          let py = this.y;
          let pos = createVector(px, py);
          let dir = createVector(cos(ang), sin(ang));
          this.particle[i] = new TimelineParticleElement(pos, dir, this.r, this.color, this.opacity);
        }
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

      isMouseOver() {
        let distance = dist(mouseX, mouseY, this.x, this.y);
        return distance < this.r;
      }

      show() {
//console.log(tparticles[selectedTimelineEllipseIndex])
        if(isTimelineSelected && tparticles[selectedTimelineEllipseIndex].countryCode === this.countryCode && tparticles[selectedTimelineEllipseIndex].year === this.year){
          stroke(this.color);
          strokeWeight(1);
          fill(red(this.color), green(this.color), blue(this.color), 80);
          ellipse(this.x, this.y, this.r);
          noStroke();
        }

        if(isTimelineSelected2 && tparticles2[selectedTimelineEllipseIndex2].countryCode === this.countryCode && tparticles2[selectedTimelineEllipseIndex2].year === this.year){
          stroke(this.color);
          strokeWeight(1);
          fill(red(this.color), green(this.color), blue(this.color), 80);
          ellipse(this.x, this.y, this.r);
          noStroke();
        }

        if(this.deaths == 0) this.color = '#797979';
        else this.color = getColorForPollution(this.deaths);
        if (this.isMouseOver()) {
          cursor('pointer');
          //fill(this.color);
          stroke(this.color);
          strokeWeight(1);
          fill(red(this.color), green(this.color), blue(this.color), 60);
          ellipse(this.x, this.y, this.r);
          noStroke();
        }
      }
}

class TimelineParticleElement {
    constructor(_pos, _dir, _r, _color, _opacity, _deaths) {
      this.pos = _pos;
      this.dir = _dir;
      this.r = _r;
      this.color = _color;
      this.deaths = _deaths;
      this.opacity = map(_opacity,0,20,5,40);
      this.history = [];
    }
  
    updateMe(x,y,r) {
      let randomScale = 0.5;
      //let randomScale = map(r, 10, 100, 0.2, 1.0);
      this.dir.x = -(this.pos.x - x) / 500 + random(-1.7, 1.7) * randomScale;
      this.dir.y = -(this.pos.y - y) / 500 + random(-1.7, 1.7) * randomScale;

      this.pos.add(this.dir);
      this.history.push(createVector(this.pos.x, this.pos.y));

      let distance = dist(this.pos.x, this.pos.y, x, y);
    if (distance > r) {
        this.pos = createVector(x, y);
    }

    // Limita o número de posições históricas
    if (this.history.length > 100) {
        this.history.splice(0, this.history.length - 100);
      }
    }
  
    drawMe() {
      noStroke();
      fill(255, this.opacity);

      ellipse(this.pos.x, this.pos.y, 1, 1);

      for (let i = 0; i < this.history.length; i++) {
        let prevPos = this.history[i];
        fill(255, this.opacity);
        ellipse(prevPos.x, prevPos.y, 1, 1);
    }
  }

  drawHistory(){
    for (let i = 0; i < this.history.length; i++) {
      let prevPos = this.history[i];
      fill(255, this.opacity);
      ellipse(prevPos.x, prevPos.y, 1, 1);
  }
  }
  }




  function mouseClicked() {
    // Verificar se o mouse está sobre uma elipse
    let isMouseOverEllipse = false;
    let clickedEllipseIndex = -1; // Armazena o índice da elipse clicada
  
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      if (p.isMouseOver()) {
        isMouseOverEllipse = true;
        clickedEllipseIndex = i;
        break; // Se estiver sobre uma elipse, não é necessário verificar as outras
      }
    }

    let isMouseOverTimelineEllipse = false;
    let isMouseOverTimelineEllipse2 = false;

    let clickedTimelineEllipseIndex = -1; // Armazena o índice da elipse clicada
    let clickedTimelineEllipseIndex2 = -1; // Armazena o índice da elipse clicada
  
    for (let i = 0; i < tparticles.length; i++) {
      let p = tparticles[i];
      if (p.isMouseOver()) {
        isMouseOverTimelineEllipse = true;
        clickedTimelineEllipseIndex = i;
        break; // Se estiver sobre uma elipse, não é necessário verificar as outras
      }
    }

      
    for (let i = 0; i < tparticles2.length; i++) {
      let p = tparticles2[i];
      if (p.isMouseOver()) {
        isMouseOverTimelineEllipse2 = true;
        clickedTimelineEllipseIndex2 = i;
        break; // Se estiver sobre uma elipse, não é necessário verificar as outras
      }
    }

    if (isMouseOverTimelineEllipse) {
      if(!isTimelineSelected){
        isTimelineSelected = true;
        selectedTimelineEllipseIndex = clickedTimelineEllipseIndex;
      }else if(isTimelineSelected && clickedTimelineEllipseIndex != selectedTimelineEllipseIndex){
        selectedTimelineEllipseIndex = clickedTimelineEllipseIndex;
      }else{
        isTimelineSelected = false;
      }
    }

    if (isMouseOverTimelineEllipse2) {
      if(!isTimelineSelected2){
        isTimelineSelected2 = true;
        selectedTimelineEllipseIndex2 = clickedTimelineEllipseIndex2;
      }else if(isTimelineSelected2 && clickedTimelineEllipseIndex2 != selectedTimelineEllipseIndex2){
        selectedTimelineEllipseIndex2 = clickedTimelineEllipseIndex2;
      }else{
        isTimelineSelected2 = false;
      }
    }

    if(isTimelineSelected && isTimelineSelected2){
      compare = true;
    }else{
      compare = false;
    }

    if(compare && mouseHoverX(width/2,height-150,10)){
      cursor('pointer');
        let urlPaginaIndividual = "compare.html?p1=" + encodeURIComponent(tparticles[selectedTimelineEllipseIndex].countryCode) + "&p2=" + encodeURIComponent(tparticles2[selectedTimelineEllipseIndex2].countryCode) + "&a1=" + tparticles[selectedTimelineEllipseIndex].year + "&a2=" + tparticles2[selectedTimelineEllipseIndex2].year;
        window.location.href = urlPaginaIndividual;
    }

  
    if (isMouseOverEllipse) {
      // Executar a lógica de clique apenas se o mouse estiver sobre uma elipse
      if (!isSelected) {
        if (!mouseClickedFlag) {
          mouseClickedFlag = true;
          isSelected = true;
          //selectedEllipseIndex = clickedEllipseIndex;
        }
      } else {
        if (!mouseClickedFlag2) {
          mouseClickedFlag2 = true;
          isSelected = false;
          //selectedEllipseIndex = clickedEllipseIndex;
        }
      }
    }

    if(mouseHoverX(25, height-85, 10)){
      country1 = '0';
      isSelected = false;
      mouseClickedFlag = false;
    }

    if(mouseHoverX(25, height-120, 10)){
      country2 = '0';
      isSelected = true;
      mouseClickedFlag2 = false;
    }

    if(mouseHoverX(width-132, 100-3,15)){
      if(!edge) edge = true;
      else edge = false;
    }

    if(mouseHoverX(40, 35,15)){
      if(!legend) legend = true;
      else legend = false;
    }

    
  }

function latLngToPixel(lat, lng) {
  let x = map(lng, -180, 180, 20, width - 20);
  let y = map(lat, 90, -90, 20, height - 20);
  return createVector(x, y);
}

function polToPixel(pol) {
  let dataValue = map(pol, 0, 746, 320, 8000);
  let size = sqrt(dataValue / PI);
  return size;
}

function polToTimeline(pol) {
  let dataValue = map(pol, 0, 746, 800, 5000);
  let size = sqrt(dataValue / PI);
  return size;
}

function polToColor(pol) {
  let opacity = map(pol, 0, 65200000, 0, 30);
  return opacity;
}

function getColorForPollution(pol) {
    // Mapeia a poluição para uma cor usando Chroma.js
    return chroma.scale(['#f2f2f2','#C2ECC8','#92E69F','#62DF75','#32d94b']).domain([0,500,10000,100000,1430000])(pol).hex(); //[10,34,57]
}//['#68b2f8','#506ee5','#7037cd','#651f71']

  function togglePlay() {
    isPlaying = !isPlaying;
  
    if (isPlaying) {
      //playButton.html('Pause');
      playButton.removeClass('play');
      playButton.addClass('pause');
      // Iniciar a atualização automática dos anos a cada 3 segundos
      autoUpdateInterval = setInterval(updateAutomatically, 300);
    } else {
      //playButton.html('Play');
      playButton.removeClass('pause');
      playButton.addClass('play');
      // Parar a atualização automática
      clearInterval(autoUpdateInterval);
    }
  }
  
  function updateAutomatically() {
    currentYear += 1;
  
    yearSlider.value(currentYear);
  }
  
  function mousePressed() {
    // Verificar se o mouse está sobre o botão de play/pause
    if ((mouseX > playButton.position().x && mouseX < playButton.position().x + playButton.width) && (mouseY > playButton.position().y && mouseY < playButton.position().y + playButton.height)) {
      togglePlay();
    }
  }

  function mouseHoverX(x,y,r){
    let distance = dist(mouseX, mouseY, x, y);
    return distance < r;
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