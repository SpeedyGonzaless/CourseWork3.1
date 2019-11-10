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

function Vertex(x,y, id, value){
  this.id = id;
  this.x = x;
  this.y = y;
  this.children = [];
  this.parents = [];
  this.semi = -1;
  this.settings = false;
  this.connect = false;
  this.deleteEdge = false;
  this.deleteVertex = false;
  this.value = value;
  this.dominatorId = 0;
  this.flag = false;
}


window.onload = function() {
  var element = document.createElement("input");
  element.setAttribute("type", "button");
  element.setAttribute("value", "invert");
  element.setAttribute("name", "button3");
  element.setAttribute("onclick", "foo()");
  var q = document.getElementById("test");
  q.appendChild(element);
  canvas = document.getElementById("drawingCanvas");
  context = canvas.getContext("2d");
  context.beginPath();
  // Определяем текущие координаты указателяим  мыши

  // Рисуем линию до новой координаты
  template_vertex = {vertex: new Vertex(canvas.width - 51, canvas.height/2, -1, -1)};

  draw_fixed_vertexes(-1);

  // Подключаем требуемые для рисования события
  canvas.onmousedown = startDrawing;
  canvas.onmouseup = stopDrawing;
  canvas.onmouseout = stopDrawing;
  canvas.onmousemove = draw;
  canvas.onclick = showSettings;
}

function draw_fixed_vertexes(vertexID) {
  context.beginPath();
  context.strokeStyle = "black";
  context.arc(template_vertex.vertex.x,template_vertex.vertex.y,30,0,2*Math.PI);
  context.stroke();
  for (let vertex of vertexes) {
    context.beginPath();
    context.strokeStyle = "black";
    if (vertexID > -1 && vertex.vertex.semi == vertexID)
      context.strokeStyle = "red";
    if (vertexID > -1 && vertexes[getVertexByID(vertexID)].vertex.semi == vertex.vertex.id)
      context.strokeStyle = "blue";
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

function isDeleteEdge(x,y) {
  for (let i = 0; i < vertexes.length; i++) {
    let vertex = vertexes[i];
    if (x > vertex.vertex.x - 40 && x < vertex.vertex.x + 40 && y < vertex.vertex.y - 30 && y > vertex.vertex.y - 100 && vertex.vertex.settings) {
      return i;
    }
  }
  return -1;
}

function isConnectVertex(x,y) {
  for (let i = 0; i < vertexes.length; i++) {
    let vertex = vertexes[i];
    if (x > vertex.vertex.x - 120 && x < vertex.vertex.x - 40 && y < vertex.vertex.y - 30 && y > vertex.vertex.y - 100 && vertex.vertex.settings) {
      return i;
    }
  }
  return -1;
}

function isDeleteVertex(x,y) {
  for (let i = 0; i < vertexes.length; i++) {
    let vertex = vertexes[i];
    if (x > vertex.vertex.x + 40 && x < vertex.vertex.x + 120 && y < vertex.vertex.y - 30 && y > vertex.vertex.y - 100 && vertex.vertex.settings) {
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
          var a = vertexes[k].vertex.x - vertex.x;
          var b = vertexes[k].vertex.y - vertex.y
          var alpha = Math.acos(a / Math.sqrt(a*a + b*b));
          var x_start, x_end, y_start, y_end;
          if (vertex.y >= vertexes[k].vertex.y) {
            x_start = vertex.x + 30 * Math.cos(alpha);
            y_start = vertex.y - 30 * Math.sin(alpha)
            x_end = vertexes[k].vertex.x - 30 * Math.cos(alpha);
            y_end = vertexes[k].vertex.y + 30 * Math.sin(alpha);
          } else {
            x_start = vertex.x + 30 * Math.cos(alpha);
            y_start = vertex.y + 30 * Math.sin(alpha)
            x_end = vertexes[k].vertex.x - 30 * Math.cos(alpha);
            y_end = vertexes[k].vertex.y - 30 * Math.sin(alpha);
          }
          context.beginPath();
          context.strokeStyle = "black";
          context.moveTo(x_start, y_start);
          context.lineTo(x_end, y_end);
          if (y_start >= y_end) {
            context.lineTo(x_end + 30 * Math.sin(alpha - Math.PI * 60 / 180), y_end + 30 * Math.cos(alpha - Math.PI * 60 / 180));
          } else {
            context.lineTo(x_end + 30 * Math.sin(alpha - Math.PI * 60 / 180), y_end - 30 * Math.cos(alpha - Math.PI * 60 / 180));
          }
          context.moveTo(x_end, y_end);
          if (y_start >= y_end) {
            context.lineTo(x_end + 30 * Math.sin(alpha - Math.PI * 120 / 180), y_end + 30 * Math.cos(alpha - Math.PI * 120 / 180));
          } else {
            context.lineTo(x_end + 30 * Math.sin(alpha - Math.PI * 120 / 180), y_end - 30 * Math.cos(alpha - Math.PI * 120 / 180));
          }

          context.stroke();
        }
      }
    }
  }
}

function drawMenu(x,y, connectVertex, deleteEdge, deleteVertex) {
  var input = document.createElement('input');
  input.type = "text";
  input.style.position = "absolute";
  input.style.left = x - 50 +'px';
  input.style.top = y + 30 +'px';
  input.style.width = '60px';
  input.setAttribute("id", "Input");
  document.body.append(input);
  var button = document.createElement("button");
  button.type = "button";
  button.innerHTML = "Submit";
  button.style.position = "absolute";
  button.style.left = x + 10 +'px';
  button.style.top = y + 30 +'px';
  button.setAttribute("onclick", "getInputValue();");
  button.setAttribute("id", "Button");
  document.body.append(button);
  var output = document.createElement("output");
  output.innerHTML = vertexes[settingVertex].vertex.value;
  output.style.position = "absolute";
  output.style.left = x - 10 +'px';
  output.style.top = y - 10 +'px';
  output.style.width = '60px';
  output.setAttribute("id", "Output");
  output.setAttribute("disabled", "true");
  document.body.append(output);
  context.beginPath();
  context.strokeStyle = "black";
  context.rect(x - 120, y - 100, 240, 70);
  context.rect(x - 120, y - 100, 80, 70);
  context.rect(x - 40, y - 100, 80, 70);
  context.rect(x + 40, y - 100, 80, 70);
  context.font = "12pt Arial";
  context.fillText("Соединить", x - 120, y - 75);
  context.fillText("вершину", x - 120, y - 55);
  context.fillText("Удалить", x - 35, y - 75);
  context.fillText("ребро", x - 35, y - 55);
  context.fillText("Удалить", x + 45, y - 75);
  context.fillText("вершину", x + 45, y - 55);
  if (connectVertex) {
    context.fillStyle = "green";
    context.fillRect(x - 120, y - 100, 80, 70);
    context.fillStyle = "black";
    context.font = "12pt Arial";
    context.fillText("Соединить", x - 120, y - 75);
    context.fillText("вершину", x - 120, y - 55);
  }
  if (deleteEdge) {
    context.fillStyle = "green";
    context.fillRect(x - 40, y - 100, 80, 70);
    context.fillStyle = "black";
    context.font = "12pt Arial";
    context.fillText("Удалить", x - 35, y - 75);
    context.fillText("ребро", x - 35, y - 55);
  }
  if (deleteVertex) {
    context.fillStyle = "green";
    context.fillRect(x + 40, y - 100, 80, 70);
    context.fillStyle = "black";
    context.font = "12pt Arial";
    context.fillText("Удалить", x + 45, y - 75);
    context.fillText("вершину", x + 45, y - 55);
  }
  context.stroke();
}

function deleteEdge(e) {
  if (settingVertex
    >= 0 && vertexes[settingVertex].vertex.deleteEdge && isDeleteEdge(e.x,e.y) >= 0) {
    vertexes[settingVertex].vertex.deleteEdge = false;
    clearCanvas();
    draw_fixed_vertexes(vertexes[settingVertex].vertex.id);
    drawEdges();
    drawMenu(vertexes[settingVertex].vertex.x, vertexes[settingVertex].vertex.y, false, false, false);
    return true;
  }
  if (settingVertex >= 0 && vertexes[settingVertex].vertex.deleteEdge) {
    var vertexTo = connectToVertex(e.x,e.y);
    clearCanvas();
    draw_fixed_vertexes(vertexes[settingVertex].vertex.id);
    drawEdges();
    drawMenu(vertexes[settingVertex].vertex.x, vertexes[settingVertex].vertex.y, false, true, false);
    if (vertexTo >= 0) {
      if (vertexes[settingVertex].vertex.children.includes(vertexTo)) {
        vertexes[settingVertex].vertex.children.splice(vertexes[settingVertex].vertex.children.indexOf(vertexTo), 1);
        vertexes[settingVertex].vertex.children.splice(vertexes[settingVertex].vertex.children.indexOf(vertexTo), 1);
        vertexes[getVertexByID(vertexTo)].vertex.parents.splice(vertexes[getVertexByID(vertexTo)].vertex.parents.indexOf(vertexes[settingVertex].vertex.id),1);
        clearDominator();
        culcDominator();
        for (let i=0; i<vertexes.length; i++){
          if (vertexes[i].vertex.semi > -1)
            vertexes[i].vertex.semi = vertexes[vertexes[i].vertex.semi].vertex.id;
        }
        clearCanvas();
        draw_fixed_vertexes(vertexes[settingVertex].vertex.id);
        drawEdges();
        drawMenu(vertexes[settingVertex].vertex.x, vertexes[settingVertex].vertex.y, false, true, false);
      }
    }
    return true;
  }
  if (isDeleteEdge(e.x,e.y) >= 0){
    clearCanvas();
    draw_fixed_vertexes(vertexes[settingVertex].vertex.id);
    drawEdges();
    drawMenu(vertexes[settingVertex].vertex.x, vertexes[settingVertex].vertex.y, false, true, false);
    vertexes[settingVertex].vertex.deleteEdge = true;
    vertexes[settingVertex].vertex.connect = false;
    return true;
  }
  return false;
}

function connectionVertex(e) {
  if (settingVertex
    >= 0 && vertexes[settingVertex].vertex.connect && isConnectVertex(e.x,e.y) >= 0) {
    vertexes[settingVertex].vertex.connect = false;
    clearCanvas();
    draw_fixed_vertexes(vertexes[settingVertex].vertex.id);
    drawEdges();
    drawMenu(vertexes[settingVertex].vertex.x, vertexes[settingVertex].vertex.y, false, false, false);
    return true;
  }
  if (settingVertex >= 0 && vertexes[settingVertex].vertex.connect) {
    var vertexTo = connectToVertex(e.x,e.y);
    clearCanvas();
    draw_fixed_vertexes(vertexes[settingVertex].vertex.id);
    drawEdges();
    drawMenu(vertexes[settingVertex].vertex.x, vertexes[settingVertex].vertex.y, true, false, false);
    if (vertexTo >= 0) {
      if (!vertexes[settingVertex].vertex.children.includes(vertexTo)) {
        vertexes[settingVertex].vertex.children.push(vertexTo);
        vertexes[getVertexByID(vertexTo)].vertex.parents.push(vertexes[settingVertex].vertex.id);
        clearDominator();
        culcDominator();
        for (let i=0; i<vertexes.length; i++){
          if (vertexes[i].vertex.semi > -1)
            vertexes[i].vertex.semi = vertexes[vertexes[i].vertex.semi].vertex.id;
        }
        clearCanvas();
        draw_fixed_vertexes(vertexes[settingVertex].vertex.id);
        drawEdges();
        drawMenu(vertexes[settingVertex].vertex.x, vertexes[settingVertex].vertex.y, true, false, false);
      }
    }
    return true;
  }
  if (isConnectVertex(e.x,e.y) >= 0){
    clearCanvas();
    draw_fixed_vertexes(vertexes[settingVertex].vertex.id);
    drawEdges();
    drawMenu(vertexes[settingVertex].vertex.x, vertexes[settingVertex].vertex.y, true, false, false);
    vertexes[settingVertex].vertex.connect = true;
    vertexes[settingVertex].vertex.deleteEdge = false;
    return true;
  }
  return false;
}

function funcDeleteVertex(e) {
  if (isDeleteVertex(e.x,e.y) >= 0){
    for (let i = 0; i < vertexes[settingVertex].vertex.parents.length; i++){
      let v_temp = vertexes[settingVertex].vertex.parents[i];
      vertexes[getVertexByID(v_temp)].vertex.children.splice(vertexes[getVertexByID(v_temp)].vertex.children.indexOf(vertexes[settingVertex].vertex.id), 1);
    }
    for (let i = 0; i< vertexes[settingVertex].vertex.children.length; i++){
      let t = getVertexByID(vertexes[settingVertex].vertex.children[i]);
      vertexes[getVertexByID(vertexes[settingVertex].vertex.children[i])].vertex.parents.splice( vertexes[getVertexByID(vertexes[settingVertex].vertex.children[i])].vertex.parents.indexOf(vertexes[settingVertex].vertex.id),1);
    }
    vertexes.splice(settingVertex, 1);
    settingVertex = -1;
    clearDominator();
    culcDominator();
    for (let i=0; i<vertexes.length; i++){
      if (vertexes[i].vertex.semi > -1)
        vertexes[i].vertex.semi = vertexes[vertexes[i].vertex.semi].vertex.id;
    }
    clearCanvas();
    draw_fixed_vertexes();
    drawEdges();
  }
  return false;
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
    clearCanvas();
    for (let i = 0; i < vertexes.length; i++) {
      let vertex = vertexes[i];
      vertex.vertex.settings = false;
      vertex.vertex.connect = false;
      vertex.vertex.deleteEdge = false;
    }
    if (deleteVertex) {
      var vertex = {
        id: deletedVertex.id,
        vertex: new Vertex(e.x, e.y, deletedVertex.vertex.id, deletedVertex.vertex.value)
      };
      vertex.vertex.children = deletedVertex.vertex.children;
      vertex.vertex.settings = deletedVertex.vertex.settings;
      vertex.vertex.connect = deletedVertex.vertex.connect;
      vertex.vertex.dominatorId = deletedVertex.vertex.dominatorId;
      vertex.vertex.semi = deletedVertex.vertex.semi;
      vertex.vertex.parents = deletedVertex.vertex.parents;
      vertexes.push(vertex);
    }
    if (deleteVertex)
      draw_fixed_vertexes(deletedVertex.vertex.id);
    else
      draw_fixed_vertexes(-1);
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
          vertex: new Vertex(e.x, e.y, IDcount, IDcount)
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
  // drawEdges();
}

function clearCanvas() {
  var element = document.getElementById("Input");
  if (typeof(element) != 'undefined' && element != null)
  {
    element.remove();
  }
  var element = document.getElementById("Output");
  if (typeof(element) != 'undefined' && element != null)
  {
    element.remove();
  }
  var element = document.getElementById("Button");
  if (typeof(element) != 'undefined' && element != null)
  {
    element.remove();
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function showSettings(e) {
  if (!connectionVertex(e) && !deleteEdge(e) && !funcDeleteVertex(e)) {
    for (let i = 0; i < vertexes.length; i++) {
      let vertex = vertexes[i].vertex;
      if (Math.pow(e.x - vertex.x, 2) + Math.pow(e.y - vertex.y, 2) <= 30 * 30) {
        clearCanvas();
        for (let j = 0; j < vertexes.length; j++) {
          vertexes[j].vertex.settings = false;
          vertexes[j].vertex.connect = false;
          vertexes[j].vertex.deleteEdge = false;
          vertexes[j].vertex.deleteVertex = false;
        }
        drawEdges();
        settingVertex = i;
        draw_fixed_vertexes(vertexes[settingVertex].vertex.id);
        vertexes[settingVertex].vertex.settings = true;
        drawMenu(vertex.x, vertex.y, false, false, false);
      }
    }
  }
}
 function getInputValue() {
   var inputVal = document.getElementById("Input").value;
   vertexes[settingVertex].vertex.value = inputVal;
   clearCanvas();
   draw_fixed_vertexes(vertexes[settingVertex].vertex.id);
   drawEdges();
   drawMenu(vertexes[settingVertex].vertex.x, vertexes[settingVertex].vertex.y, false, false, false)
 }

function getVertexByID(ID) {
  for (let i=0; i<vertexes.length; i++){
    if (vertexes[i].vertex.id == ID)
      return i;
  }
}

