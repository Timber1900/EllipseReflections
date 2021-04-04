let mainField;
let test;
let angle;
let posAngle = 0.5;
let pos;
let ray1;
let ray2;
let last = true;


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  mainField = new Field(0.35*width, 0.35*height, createVector(0, 0));
  angle= -2;
  pos = createVector(mainField.width*cos(posAngle)-1, mainField.height*sin(posAngle)-1)
  ray1 = new Ray(pos, createVector(cos(angle), sin(angle)));
  ray2 = new Ray(pos, createVector(cos(angle), sin(angle)));

}

function draw() {
  frameRate(144)
  background(24, 26, 27);
  mainField.show();

  ray1.cast(mainField)
  ray2.cast(mainField)
  ray2.show(color(255, 70, 0, 100))
  ray1.show(color(0, 70, 255, 100))

}

function mouseClicked() {
  if(last) {
    ray1.prevPoints = [ray1.prevPoints[0]];
    ray1.pos = ray1.prevPoints[0]
    ray1.updateMouse()
  } else {
    ray2.prevPoints = [ray2.prevPoints[0]];
    ray2.pos = ray2.prevPoints[0]
    ray2.updateMouse()
  }
  last = !last
  
}

class Field {
  constructor(w, h, c) {
    this.width = w;
    this.height = h;
    this.center = c;
  }

  show() {
    push();
    translate(width/2, height/2);
    fill(180);
    stroke(12, 13, 14);
    strokeWeight(5);
    ellipse(this.center.x, this.center.y, this.width*2, this.height*2);
    const centerOffset = sqrt(pow(this.width, 2) - pow(this.height, 2));
    fill(220, 20, 20);
    noStroke();
    ellipse(this.center.x - centerOffset, this.center.y, 10, 10);
    ellipse(this.center.x + centerOffset, this.center.y, 10, 10);
    pop();
  }
}

class Ray {
  constructor(p, d) {
    this.pos = p;
    this.dir = d;
    this.initialDir = d;
    this.prevPoints = [this.pos]
    this.dir.normalize();
  }

  show(color) {
    drawArrow(this.prevPoints[0], p5.Vector.mult(this.initialDir, 100), 'red');
    push()
    translate(width/2, height/2)
    stroke(color)
    strokeWeight(1)

    for(let i = 0; i < this.prevPoints.length - 1; i++) {
      const p1 = this.prevPoints[i]
      const p2 = this.prevPoints[i+1]

      line(p1.x, p1.y, p2.x, p2.y)
    }
    pop()

  }

  cast(field) {
    const a = this.dir.y * field.width;
    const b = this.dir.x * field.height;
    const c = this.dir.y * this.pos.x - this.dir.x * this.pos.y


    const t = findResult(a, b, c);

    const m = findTangent(field.width, field.height, t);
    const x = field.width * cos(t)
    const y = field.height * sin(t)

    const d = y - m*x;

    const tangentVector = this.dir.y > 0 ? createVector(m, -1) : createVector(-m, 1);
    tangentVector.normalize();
    this.dir.normalize()

    const dot = p5.Vector.dot(p5.Vector.mult(this.dir, -1), tangentVector);
    const angle = acos(dot)
    const newDir1 = p5.Vector.fromAngle(p5.Vector.mult(this.dir, -1).heading() - 2*angle, 1)
    const newDir2 = p5.Vector.fromAngle(p5.Vector.mult(this.dir, -1).heading() + 2*angle, 1)

    const newDirs = [newDir1, newDir2]
    const dots = [p5.Vector.dot(newDir1, tangentVector), p5.Vector.dot(newDir2, tangentVector)]

    let newDir;
    for(let i = 0; i < dots.length; i++){
      if(abs(dots[i] - dot) <= 0.00001 ) {
        newDir = createVector(newDirs[i].x, newDirs[i].y);
      } 
    }

    // push()
    // translate(width/2, height/2);
    // fill(255, 10, 10);
    // noStroke();
    // ellipse(x, y, 10, 10)
    // noFill()
    // strokeWeight(2)
    // stroke(0)
    // line(-1000, -1000 * m + d, 1000, 1000 * m + d)
    // translate(-width/2, -height/2);
    // drawArrow(createVector(x, y), p5.Vector.mult(tangentVector, 100), 'red')
    // drawArrow(createVector(x, y), p5.Vector.mult(this.dir, -100), 'blue')
    // drawArrow(createVector(x, y), p5.Vector.mult(newDir, 100), 'blue')
    // pop()
    
    this.prevPoints.push(createVector(this.pos.x, this.pos.y))
    this.dir = newDir;
    this.pos = createVector(x, y)
  }

  updateMouse() {
    this.dir = createVector(mouseX - width/2 - this.prevPoints[0].x, mouseY - height/2 - this.prevPoints[0].y);
    this.dir.normalize();
    this.initialDir = this.dir;
  }

  lookToPoint(point) {
    this.dir = p5.Vector.sub(point, this.pos);
    this.dir.normalize()
    this.initialDir = this.dir;

  }
}

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x + width/2, base.y+height/2);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

const findResult = (a, b, c) => {
  return(2*(atan((sqrt(pow(a,2) + pow(b,2) - pow(c,2)) - b) / (a + c))))
}

const findTangent = (a, b, t) => {
  return(-(b * cos(t)) / (a * sin(t)))
}

