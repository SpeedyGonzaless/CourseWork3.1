var canvas;
var context;
var vertexes = [];
var deleteVertex = false;
var settingVertex = -1;
var connectVertex = false;
var vertexConnectionStarted = false;
var newVertex = false;
var delEdge = false;
var deleteEdgeStarted = false;
var moveVertexes = false;
var moveVertexesStarted = false;
var changeValue = false;
var info = false;
var IDcount =1;

function Vertex(x,y, id, value){
  this.id = id;
  this.x = x;
  this.y = y;
  this.children = [];
  this.parents = [];
  this.semi = -1;
  this.domins = [];
  this.value = value;
  this.dominatorId = 0;
  this.flag = false;
}


window.onload = function() {
  canvas = document.getElementById("drawingCanvas");
  context = canvas.getContext("2d");
  context.beginPath();
  draw_fixed_vertexes(-1);
  canvas.onmousemove = draw;
  canvas.onclick = action;

}


function draw_fixed_vertexes(vertexID) {
  if (info) {
    context.beginPath();
    context.strokeStyle = "green";
    context.font = "10px Arial";
    context.arc(50,50 + document.documentElement.scrollTop,30,0,2*Math.PI);
    context.fillText("Выбранная", 85, 40 + document.documentElement.scrollTop);
    context.fillText("вершина", 85, 60 + document.documentElement.scrollTop);
    context.stroke();
    context.beginPath();
    context.strokeStyle = "darkviolet";
    context.font = "10px Arial";
    context.arc(190,50 + document.documentElement.scrollTop,30,0,2*Math.PI);
    context.fillText("Непосредственный", 225, 40 + document.documentElement.scrollTop);
    context.fillText("доминатор", 225, 60 + document.documentElement.scrollTop);
    context.stroke();
    context.beginPath();
    context.strokeStyle = "red";
    context.font = "10px Arial";
    context.arc(350,50 + document.documentElement.scrollTop,30,0,2*Math.PI);
    context.fillText("Зависимая", 385, 40 + document.documentElement.scrollTop);
    context.fillText("вершина", 385, 60 + document.documentElement.scrollTop);
    context.stroke();
    context.beginPath();
    context.strokeStyle = "blue";
    context.font = "10px Arial";
    context.arc(500,50 + document.documentElement.scrollTop,30,0,2*Math.PI);
    context.fillText("Доминатор", 535, 50 + document.documentElement.scrollTop);
    context.stroke();
  }
  context.strokeStyle = "black";
  context.beginPath();
  for (let vertex of vertexes) {
    context.beginPath();
    context.strokeStyle = "black";
    if (vertexID > -1 && vertex.vertex.semi == vertexID)
      context.strokeStyle = "red";
    if (vertexID > -1 && vertexes[getVertexByID(vertexID)].vertex.semi == vertex.vertex.id)
      context.strokeStyle = "darkviolet";
    if ((!newVertex && !connectVertex && !delEdge && !deleteVertex && !moveVertexes && !changeValue ||changeValue) && vertexID == vertex.vertex.id)
      context.strokeStyle = "green";
    if (vertexID > -1 && vertexes[getVertexByID(vertexID)].vertex.domins.indexOf(vertex.vertex.id) != -1)
      context.strokeStyle = "blue";

    context.font = "20px Arial";
    context.fillText(vertex.vertex.value, vertex.vertex.x - 5, vertex.vertex.y + 5);
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

function draw(e) {
  var x = e.x + document.documentElement.scrollLeft;
  var y = e.y + document.documentElement.scrollTop;
  if (newVertex){
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
    context.beginPath();
    context.arc(x,y,30,0,2*Math.PI);
    context.stroke();
  }
  if (vertexConnectionStarted){
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
    context.beginPath();
    var startVertex = vertexes[getVertexByID(settingVertex)];
    context.moveTo(startVertex.vertex.x, startVertex.vertex.y);
    context.lineTo(x,y);
    context.stroke();
  }
  if (deleteEdgeStarted){
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
    context.beginPath();
    var startVertex = vertexes[getVertexByID(settingVertex)];
    context.strokeStyle = "red";
    context.moveTo(startVertex.vertex.x, startVertex.vertex.y);
    context.lineTo(x,y);
    context.stroke();
    context.strokeStyle = "black";
  }
  if (deleteVertex){
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
    context.beginPath();
    context.strokeStyle = "red";
    context.arc(x,y,30,0,2*Math.PI);
    context.stroke();
    context.strokeStyle = "black";
  }
  if (moveVertexesStarted){
    vertexes[getVertexByID(settingVertex)].vertex.x = x;
    vertexes[getVertexByID(settingVertex)].vertex.y = y;
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
  }
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

 function getInputValue() {
   if (changeValue) {
     var inputVal = document.getElementById("Input").value;
     vertexes[getVertexByID(settingVertex)].vertex.value = inputVal;
     clearCanvas();
     draw_fixed_vertexes(settingVertex);
     drawEdges();
   }
 }

function getVertexByID(ID) {
  for (let i=0; i<vertexes.length; i++){
    if (vertexes[i].vertex.id == ID)
      return i;
  }
}

function action(e) {
  var x = e.x + document.documentElement.scrollLeft;
  var y = e.y + document.documentElement.scrollTop;
  if (newVertex){
    var vertex = {
      id: IDcount,
      vertex: new Vertex(x, y, IDcount, IDcount)
    };
    IDcount++;
    vertexes.push(vertex);
    var height = document.getElementById("drawingCanvas").height;
    if (vertex.vertex.y > height - 200){
      document.getElementById("drawingCanvas").height = height + 200;
    }
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
  }
  var connectionFinished = false;
  if (vertexConnectionStarted) {
    var endVertex = detectVertex(x,y);
    if (endVertex != -1){
      vertexes[getVertexByID(settingVertex)].vertex.children.push(endVertex);
      vertexes[getVertexByID(endVertex)].vertex.parents.push(settingVertex);
      clearCanvas();
      draw_fixed_vertexes(-1);
      drawEdges();
      vertexConnectionStarted = false;
      connectionFinished = true;
    }
  }
  if (connectVertex && !vertexConnectionStarted && !connectionFinished) {
    settingVertex = detectVertex(x,y)
    if (settingVertex != -1){
      vertexConnectionStarted = true;
    }
  }

  var deleteEdgeFinished = false
  if (deleteEdgeStarted) {
    var endVertex = detectVertex(x,y);
    if (endVertex != -1){
      if (vertexes[getVertexByID(settingVertex)].vertex.children.indexOf(endVertex) != -1) {
        vertexes[getVertexByID(settingVertex)].vertex.children.splice(vertexes[getVertexByID(settingVertex)].vertex.children.indexOf(endVertex), 1);
        vertexes[getVertexByID(endVertex)].vertex.parents.splice(vertexes[getVertexByID(endVertex)].vertex.parents.indexOf(settingVertex), 1);
      }
      clearCanvas();
      draw_fixed_vertexes(-1);
      drawEdges();
      deleteEdgeStarted = false;
      deleteEdgeFinished = true;
    }
  }
  if (delEdge && !deleteEdgeStarted && !deleteEdgeFinished) {
    settingVertex = detectVertex(x,y)
    if (settingVertex != -1){
      deleteEdgeStarted = true;
    }
  }

  if (deleteVertex){
    settingVertex = detectVertex(x,y);
    if (settingVertex != -1) {
      for (let i=0; i<vertexes[getVertexByID(settingVertex)].vertex.children.length; i++){
        var index = getVertexByID(vertexes[getVertexByID(settingVertex)].vertex.children[i]);
        vertexes[index].vertex.parents.splice(vertexes[index].vertex.parents.indexOf(settingVertex),1);
      }
      for (let i=0; i<vertexes[getVertexByID(settingVertex)].vertex.parents.length; i++){
        var index = getVertexByID(vertexes[getVertexByID(settingVertex)].vertex.parents[i]);
        vertexes[index].vertex.children.splice(vertexes[index].vertex.children.indexOf(settingVertex),1);
      }
      vertexes.splice(getVertexByID(settingVertex), 1);
      clearCanvas();
      draw_fixed_vertexes(-1);
      drawEdges();
    }
  }

  var moveVertexFinished = false;
  if (moveVertexesStarted) {
    moveVertexFinished = true;
    moveVertexesStarted = false;
    var height = document.getElementById("drawingCanvas").height;
    if (vertexes[getVertexByID(settingVertex)].vertex.y > height - 200){
      document.getElementById("drawingCanvas").height = height + 200;
      clearCanvas();
      draw_fixed_vertexes(-1);
      drawEdges();
    }
  }
  if (moveVertexes && !moveVertexFinished){
    settingVertex = detectVertex(x,y);
    if (settingVertex != -1 && !moveVertexFinished){
      moveVertexesStarted = true;
    }
  }

  if (changeValue){
    settingVertex = detectVertex(x,y);
    if (settingVertex != -1) {
      document.getElementById("Settings").style.height = '500px';
      var check = document.getElementById('Input');
      if (!(typeof(check) != 'undefined' && check != null)) {
        var input = document.createElement('input');
        input.type = "text";
        input.style.position = "absolute";
        input.style.left = '1px';
        input.style.top = '403px';
        input.style.width = '94px';
        input.style.height = '40px';
        input.placeholder = 'Значение'
        input.setAttribute("id", "Input");
        document.getElementById("Settings").append(input);
        var button = document.createElement("button");
        button.type = "button";
        button.innerHTML = "Подтвердить";
        button.style.position = "absolute";
        button.style.top = '450px';
        button.style.height = '50px';
        button.style.width = '100px';
        button.style.borderColor = 'red';
        button.setAttribute("onclick", "getInputValue();");
        button.setAttribute("id", "SubmitChange");
        document.getElementById("Settings").append(button);
      }
      clearCanvas();
      draw_fixed_vertexes(settingVertex);
      drawEdges();
    } else {
      document.getElementById("Settings").style.height = '400px';
      var input = document.getElementById('Input');
      var button = document.getElementById('SubmitChange');
      if (typeof(input) != 'undefined' && input != null){
        input.parentNode.removeChild(input);
        button.parentNode.removeChild(button);
      }
      clearCanvas();
      draw_fixed_vertexes(-1);
      drawEdges();
    }
  }

  if (!newVertex && !connectVertex && !delEdge && !deleteVertex && !moveVertexes && !changeValue){
    settingVertex = detectVertex(x,y);
    if (settingVertex != -1) {
      clearDominator();
      culcDominator();
      for (let i = 0; i < vertexes.length; i++) {
        if (vertexes[i].vertex.semi > -1) {
          var parentDomi = vertexes[vertexes[i].vertex.semi].vertex.semi;
          while (parentDomi != -1){
            vertexes[i].vertex.domins.push(vertexes[parentDomi].vertex.id);
            parentDomi = vertexes[parentDomi].vertex.semi;
          }
        }
      }
      for (let i = 0; i < vertexes.length; i++) {
        if (vertexes[i].vertex.semi > -1) {
          vertexes[i].vertex.semi = vertexes[vertexes[i].vertex.semi].vertex.id;
        }
      }
      clearCanvas();
      draw_fixed_vertexes(settingVertex);
      drawEdges();
    }
  }
}

