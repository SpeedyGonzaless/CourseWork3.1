var canvas;
var context;
var template_vertex;
var vertexes = [];
var deleteVertex = false;
var settingVertex = -1;
var deletedVertex;
var newVertex = false;
var isDrawing = false;
var IDcount =1;

function Vertex(x,y, id){
  this.id = id;
  this.x = x;
  this.y = y;
  this.children = [];
  this.settings = false;
  this.connect = false;
}

window.onload = function() {
  canvas = document.getElementById("drawingCanvas");
  context = canvas.getContext("2d");
  context.beginPath();
  // Определяем текущие координаты указателяим  мыши

  // Рисуем линию до новой координаты
  template_vertex = {vertex: new Vertex(canvas.width - 51, canvas.height/2, -1)};

  draw_fixed_vertexes();

  // Подключаем требуемые для рисования события
  canvas.onmousedown = startDrawing;
  canvas.onmouseup = stopDrawing;
  canvas.onmouseout = stopDrawing;
  canvas.onmousemove = draw;
  canvas.onclick = showSettings;
}

function draw_fixed_vertexes() {
  context.beginPath();
  context.arc(template_vertex.vertex.x,template_vertex.vertex.y,30,0,2*Math.PI);
  context.stroke();
  for (let vertex of vertexes) {
    context.beginPath();
    context.arc(vertex.vertex.x,vertex.vertex.y,30,0,2*Math.PI);
    context.stroke();
  }
}

function detectVertex(x,y) {
  for (let i = 0; i < vertexes.length; i++) {
    let vertex = vertexes[i];
    if (Math.pow(x - vertex.vertex.x, 2) + Math.pow(y - vertex.vertex.y, 2) <= 30*30) {
      return vertex.id;
    }
  }
  return false;
}

function moveVertex(x,y, id) {
  for (let i = 0; i < vertexes.length; i++) {
    let vertex = vertexes[i];
    if (vertex.id == id) {
      deletedVertex = vertexes[i];
      vertexes.splice(i,1);
    }
  }
}

function isConnectVertex(x,y) {
  for (let i = 0; i < vertexes.length; i++) {
    let vertex = vertexes[i];
    if (x > vertex.vertex.x - 120 && x < vertex.vertex.x + 40 && y < vertex.vertex.y - 30 && y > vertex.vertex.y - 100 && vertex.vertex.settings) {
      return i;
    }
  }
  return -1;
}

function connectToVertex(x,y) {
  for (let i = 0; i < vertexes.length; i++) {
    let vertex = vertexes[i];
    if (Math.pow(x - vertex.vertex.x, 2) + Math.pow(y - vertex.vertex.y, 2) <= 30*30) {
      return vertex.id;
    }
  }
  return -1;
}

function drawEdges() {
  for (let i = 0; i < vertexes.length; i++) {
    var vertex = vertexes[i].vertex;
    for (let j = 0; j < vertex.children.length; j++) {
      var childVertex = vertex.children[j];
      for (let k=0; k<vertexes.length; k++) {
        if (vertexes[k].id == childVertex) {
          context.beginPath();
          context.moveTo(vertex.x, vertex.y);
          context.lineTo(vertexes[k].vertex.x, vertexes[k].vertex.y);
          context.stroke();
        }
      }
    }
  }
}


function startDrawing(e) {
  if ((Math.pow(e.x - (canvas.width - 51), 2) + Math.pow(e.y - (canvas.height/2), 2)) <= 30*30) {
    // Начинаем рисовать
    isDrawing = true;
  } else if (detectVertex(e.x,e.y)) {
    isDrawing = true;
    deleteVertex = detectVertex(e.x,e.y);
  }
}

function draw(e) {
  if (isDrawing) {
    if (deleteVertex) {
      moveVertex(e.x, e.y, deleteVertex);
    }
    mouseMoved = true;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < vertexes.length; i++) {
      let vertex = vertexes[i];
      vertex.vertex.settings = false;
      vertex.vertex.connect = false;
    }
    if (deleteVertex) {
      var vertex = {
        id: deletedVertex.id,
        vertex: new Vertex(e.x, e.y, deletedVertex.vertex.id)
      };
      vertex.vertex.children = deletedVertex.vertex.children;
      vertex.vertex.settings = deletedVertex.vertex.settings;
      vertex.vertex.connect = deletedVertex.vertex.connect;
      vertexes.push(vertex);
    }
    draw_fixed_vertexes();
    drawEdges();
    context.beginPath();
    // Определяем текущие координаты указателя мыши
    var x = e.x;
    var y = e.y;

    // Рисуем линию до новой координаты
    context.arc(x,y,30,0,2*Math.PI);
    context.stroke();
  }
}

function stopDrawing(e) {
  if (isDrawing) {
    isDrawing = false;
    if (mouseMoved) {
      if (!deletedVertex) {
        var vertex = {
          id: IDcount,
          vertex: new Vertex(e.x, e.y, IDcount)
        };
        IDcount++;
        vertexes.push(vertex);
      }
      mouseMoved = false;
    }
    isDrawing = false;
    deletedVertex = false;
    deleteVertex = false;
  }
  drawEdges();
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function showSettings(e) {
  if (settingVertex >= 0 && vertexes[settingVertex].vertex.connect) {
    vertexTo = connectToVertex(e.x,e.y);
    if (vertexTo >= 0) {
      vertexes[settingVertex].vertex.children.push(vertexTo);
    }
    drawEdges();
    return;
  }
  if (isConnectVertex(e.x,e.y) >= 0){
    context.beginPath();
    context.fillStyle = "green";
    context.fillRect(vertexes[settingVertex].vertex.x - 120, vertexes[settingVertex].vertex.y - 100, 80, 70);
    context.fillStyle = "black";
    context.font = "12pt Arial";
    context.fillText("Соединить", vertexes[settingVertex].vertex.x - 120, vertexes[settingVertex].vertex.y - 75);
    context.fillText("вершину", vertexes[settingVertex].vertex.x - 120, vertexes[settingVertex].vertex.y - 55);
    context.stroke();
    vertexes[settingVertex].vertex.connect = true;
    return;
  }
  for (let i = 0; i < vertexes.length; i++) {
    let vertex = vertexes[i].vertex;
    if (Math.pow(e.x - vertex.x, 2) + Math.pow(e.y - vertex.y, 2) <= 30*30) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (let j = 0; j < vertexes.length; j++) {
        vertexes[j].vertex.settings = false;
        vertexes[j].vertex.connect = false;
      }
      draw_fixed_vertexes();
      drawEdges();
      settingVertex = i;
      vertexes[settingVertex].vertex.settings = true;
      context.beginPath();
      context.rect(vertex.x - 120, vertex.y - 100, 240, 70);
      context.rect(vertex.x - 120, vertex.y - 100, 80, 70);
      context.font = "12pt Arial";
      context.fillText("Соединить", vertex.x - 120, vertex.y - 75);
      context.fillText("вершину", vertex.x - 120, vertex.y - 55);
      context.stroke();
    }
  }
}

