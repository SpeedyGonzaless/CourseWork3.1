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
    context.fillStyle = "green";
    context.arc(50,50 + document.documentElement.scrollTop,30,0,2*Math.PI);
    context.fill();

    context.beginPath();
    context.fillStyle = "white";
    context.arc(50,50 + document.documentElement.scrollTop,20,0,2*Math.PI);
    context.fill();

    context.beginPath();
    context.fillStyle = "green";
    context.font = "10px Arial";
    context.fillText("Выбранная", 85, 40 + document.documentElement.scrollTop);
    context.fillText("вершина", 85, 60 + document.documentElement.scrollTop);
    context.stroke();




    context.beginPath();
    context.fillStyle = "darkviolet";
    context.arc(190,50 + document.documentElement.scrollTop,30,0,2*Math.PI);
    context.fill();

    context.beginPath();
    context.fillStyle = "white";
    context.arc(190,50 + document.documentElement.scrollTop,20,0,2*Math.PI);
    context.fill();

    context.beginPath();
    context.fillStyle = "darkviolet";
    context.font = "10px Arial";
    context.fillText("Непосредственный", 225, 40 + document.documentElement.scrollTop);
    context.fillText("доминатор", 225, 60 + document.documentElement.scrollTop);
    context.stroke();



    context.beginPath();
    context.fillStyle = "red";
    context.arc(350,50 + document.documentElement.scrollTop,30,0,2*Math.PI);
    context.fill();

    context.beginPath();
    context.fillStyle = "white";
    context.arc(350,50 + document.documentElement.scrollTop,20,0,2*Math.PI);
    context.fill();

    context.beginPath();
    context.fillStyle = "red";
    context.font = "10px Arial";
    context.fillText("Зависимая", 385, 40 + document.documentElement.scrollTop);
    context.fillText("вершина", 385, 60 + document.documentElement.scrollTop);
    context.stroke();




    context.beginPath();
    context.fillStyle = "blue";
    context.arc(500,50 + document.documentElement.scrollTop,30,0,2*Math.PI);
    context.fill();

    context.beginPath();
    context.fillStyle = "white";
    context.arc(500,50 + document.documentElement.scrollTop,20,0,2*Math.PI);
    context.fill();

    context.beginPath();
    context.fillStyle = "blue";
    context.font = "10px Arial";
    context.fillText("Доминатор", 535, 50 + document.documentElement.scrollTop);
    context.stroke();
  }
  context.fillStyle = "black";
  for (let vertex of vertexes) {
    context.beginPath();
    context.fillStyle = "black";
    if (vertexID > -1 && vertex.vertex.semi == vertexID)
      context.fillStyle = "red";
    if (vertexID > -1 && vertexes[getVertexByID(vertexID)].vertex.semi == vertex.vertex.id)
      context.fillStyle = "darkviolet";
    if ((!newVertex && !connectVertex && !delEdge && !deleteVertex && !moveVertexes && !changeValue ||changeValue) && vertexID == vertex.vertex.id)
      context.fillStyle = "green";
    if (vertexID > -1 && vertexes[getVertexByID(vertexID)].vertex.domins.indexOf(vertex.vertex.id) != -1)
      context.fillStyle = "blue";
    context.arc(vertex.vertex.x,vertex.vertex.y,30,0,2*Math.PI);
    context.fill();
    context.beginPath();
    context.fillStyle = "white";
    context.arc(vertex.vertex.x,vertex.vertex.y,20,0,2*Math.PI);
    context.fill();

    context.beginPath();
    context.fillStyle = "black";
    if ((vertex.vertex.value + '').length == 1) {
      context.font = "20px Arial";
      context.fillText(vertex.vertex.value, vertex.vertex.x - 5, vertex.vertex.y + 5);
    } else if ((vertex.vertex.value.length + '') == 2) {
      context.font = "20px Arial";
      context.fillText(vertex.vertex.value, vertex.vertex.x - 13, vertex.vertex.y + 5);
    } else if ((vertex.vertex.value + '').length == 3) {
      context.font = "15px Arial";
      context.fillText(vertex.vertex.value, vertex.vertex.x - 15, vertex.vertex.y + 5);
    } else {
      context.font = "15px Arial";
      context.fillText(vertex.vertex.value.substring(0,3) + '...', vertex.vertex.x - 19, vertex.vertex.y + 5);
    }
    context.stroke();
  }
}


function detectVertex(x,y,R) {
  for (let i = 0; i < vertexes.length; i++) {
    let vertex = vertexes[i];
    if (Math.pow(x - vertex.vertex.x, 2) + Math.pow(y - vertex.vertex.y, 2) <= R*R) {
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
          drawEdge(vertexes[k].vertex.x, vertexes[k].vertex.y, vertex.x, vertex.y, "black")
        }
      }
    }
  }
}

function drawEdge(v1_x, v1_y, v2_x, v2_y, color) {
  let angle = Math.PI / 18 * 17;
  var a = v1_x - v2_x;
  var b = v1_y - v2_y;
  var alpha = Math.acos(a / Math.sqrt(a*a + b*b));
  var x_start1, x_end1,y_start1,y_end1,x_start2, x_end2, y_start2, y_end2, x_start, y_start, x_end, y_end;
  if (v2_y >= v1_y) {
    x_start = v2_x + 30 * Math.cos(alpha);
    y_start = v2_y - 30 * Math.sin(alpha);

    x_start1 = v2_x - 30 * Math.cos(angle - alpha);
    y_start1 = v2_y - 30 * Math.sin(angle - alpha);
    x_start2 = v2_x - 30 * Math.cos(angle + alpha);
    y_start2 = v2_y + 30 * Math.sin(angle + alpha);

    x_end = v1_x - 30 * Math.cos(alpha);
    y_end = v1_y + 30 * Math.sin(alpha);

    x_end1 = v1_x + 50 * Math.cos(angle + alpha);
    y_end1 = v1_y - 50 * Math.sin( angle + alpha);
    x_end2 = v1_x + 50 * Math.cos(angle - alpha);
    y_end2 = v1_y + 50 * Math.sin( angle - alpha);
  } else {
    x_start = v2_x + 30 * Math.cos(alpha);
    y_start = v2_y + 30 * Math.sin(alpha)

    x_start1 = v2_x - 30 * Math.cos(angle - alpha);
    y_start1 = v2_y + 30 * Math.sin(angle - alpha);
    x_start2 = v2_x - 30 * Math.cos(angle + alpha);
    y_start2 = v2_y - 30 * Math.sin(angle + alpha);

    x_end = v1_x - 30 * Math.cos(alpha);
    y_end = v1_y - 30 * Math.sin(alpha);

    x_end1 = v1_x + 50 * Math.cos(alpha + angle);
    y_end1 = v1_y + 50 * Math.sin(alpha + angle);
    x_end2 = v1_x + 50 * Math.cos(alpha - angle);
    y_end2 = v1_y + 50 * Math.sin(alpha - angle);
  }
  context.beginPath();
  context.fillStyle = color;
  context.moveTo(x_start1, y_start1);
  context.lineTo(x_end1, y_end1);
  context.lineTo(x_end2, y_end2);
  context.lineTo(x_start2, y_start2);
  context.fill();
  context.beginPath();
  context.fillStyle = color;
  context.moveTo(x_end, y_end);
  if (y_start >= y_end) {
    context.lineTo(x_end + 50 * Math.sin(alpha - Math.PI * 60 / 180), y_end + 50 * Math.cos(alpha - Math.PI * 60 / 180));
  } else {
    context.lineTo(x_end + 50 * Math.sin(alpha - Math.PI * 60 / 180), y_end - 50 * Math.cos(alpha - Math.PI * 60 / 180));
  }
  if (y_start >= y_end) {
    context.lineTo(x_end + 50 * Math.sin(alpha - Math.PI * 120 / 180), y_end + 50 * Math.cos(alpha - Math.PI * 120 / 180));
  } else {
    context.lineTo(x_end + 50 * Math.sin(alpha - Math.PI * 120 / 180), y_end - 50 * Math.cos(alpha - Math.PI * 120 / 180));
  }
  context.fill();
}

function draw(e) {
  var x = e.x + document.documentElement.scrollLeft;
  var y = e.y + document.documentElement.scrollTop;
  if (newVertex){
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
    context.beginPath();
    context.fillStyle = "black";
    context.arc(x,y,30,0,2*Math.PI);
    context.fill();
    context.beginPath();
    context.fillStyle = "white";
    context.arc(x,y,20,0,2*Math.PI);
    context.fill();
  }
  if (vertexConnectionStarted){
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
    var startVertex = vertexes[getVertexByID(settingVertex)];
    if (detectVertex(x,y, 60) != startVertex.vertex.id) {
      drawEdge(x, y, startVertex.vertex.x, startVertex.vertex.y, "black");
    }
  }
  if (deleteEdgeStarted){
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
    var startVertex = vertexes[getVertexByID(settingVertex)];
    if (detectVertex(x,y,60) != startVertex.vertex.id) {
      drawEdge(x, y, startVertex.vertex.x, startVertex.vertex.y, "red");
    }
    context.strokeStyle = "black";
  }
  if (deleteVertex){
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
    context.beginPath();
    context.fillStyle = "red";
    context.arc(x,y,30,0,2*Math.PI);
    context.fill();
    context.beginPath();
    context.fillStyle = "white";
    context.arc(x,y,20,0,2*Math.PI);
    context.fill();
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
    var endVertex = detectVertex(x,y, 30);
    if (endVertex != -1){
      vertexes[getVertexByID(settingVertex)].vertex.children.push(endVertex);
      vertexes[getVertexByID(endVertex)].vertex.parents.push(settingVertex);
      clearCanvas();
      draw_fixed_vertexes(-1);
      drawEdges();
      vertexConnectionStarted = false;
      connectionFinished = true;
    } else {
      vertexConnectionStarted = false;
      clearCanvas();
      draw_fixed_vertexes(-1);
      drawEdges();
    }
  }
  if (connectVertex && !vertexConnectionStarted && !connectionFinished) {
    settingVertex = detectVertex(x,y, 30)
    if (settingVertex != -1){
      vertexConnectionStarted = true;
    }
  }

  var deleteEdgeFinished = false
  if (deleteEdgeStarted) {
    var endVertex = detectVertex(x,y, 30);
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
    } else {
      deleteEdgeStarted = false;
      clearCanvas();
      draw_fixed_vertexes(-1);
      drawEdges();
    }
  }
  if (delEdge && !deleteEdgeStarted && !deleteEdgeFinished) {
    settingVertex = detectVertex(x,y, 30)
    if (settingVertex != -1){
      deleteEdgeStarted = true;
    }
  }

  if (deleteVertex){
    settingVertex = detectVertex(x,y, 30);
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
    settingVertex = detectVertex(x,y, 30);
    if (settingVertex != -1 && !moveVertexFinished){
      moveVertexesStarted = true;
    }
  }

  if (changeValue){
    settingVertex = detectVertex(x,y, 30);
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
    settingVertex = detectVertex(x,y,30);
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

