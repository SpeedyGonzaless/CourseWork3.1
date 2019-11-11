function addVertexButton() {
  newVertex = !newVertex;
  if (newVertex){
    clearButtons();
    newVertex = true;
    document.getElementById("AddVertex").style.backgroundColor = "red";
  } else {
    document.getElementById("AddVertex").style.backgroundColor = "#4CAF50";
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
  }
}

function connectVertexButton() {
  connectVertex = !connectVertex;
  if (connectVertex){
    clearButtons();
    connectVertex = true;
    document.getElementById("ConnectVertexes").style.backgroundColor = "red";
  } else {
    vertexConnectionStarted = false;
    connectVertex = false;
    document.getElementById("ConnectVertexes").style.backgroundColor = "#4CAF50";
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
  }
}

function deleteEdgeButton() {
  delEdge = !delEdge;
  if (delEdge){
    clearButtons();
    delEdge = true;
    document.getElementById("DeleteEdge").style.backgroundColor = "red";
  } else {
    delEdge = false;
    deleteEdgeStarted = false;
    document.getElementById("DeleteEdge").style.backgroundColor = "#4CAF50";
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
  }
}

function deleteVertexButton() {
  deleteVertex = !deleteVertex;
  if (deleteVertex) {
    clearButtons();
    deleteVertex = true;
    document.getElementById("DeleteVertex").style.backgroundColor = "red";
  } else {
    deleteVertex = false;
    document.getElementById("DeleteVertex").style.backgroundColor = "#4CAF50";
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
  }
}

function moveVertexButton() {
  moveVertexes = !moveVertexes;
  if (moveVertexes) {
    clearButtons();
    moveVertexes = true;
    document.getElementById("MoveVertex").style.backgroundColor = "red";
  } else {
    moveVertexes = false;
    moveVertexesStarted = false;
    document.getElementById("MoveVertex").style.backgroundColor = "#4CAF50";
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
  }
}

function changeValueButton() {
  changeValue = !changeValue;
  if (changeValue) {
    clearButtons();
    changeValue = true;
    document.getElementById("ChangeValue").style.backgroundColor = "red";
  } else {
    changeValue = false;
    document.getElementById("ChangeValue").style.backgroundColor = "#4CAF50";
    document.getElementById("Settings").style.height = '350px';
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

function clearButtons() {
  if (newVertex) {
    newVertex = false;
    document.getElementById("AddVertex").style.backgroundColor = "#4CAF50";
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
  }
  if (connectVertex) {
    connectVertex = false;
    vertexConnectionStarted = false;
    document.getElementById("ConnectVertexes").style.backgroundColor = "#4CAF50";
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
  }
  if (delEdge){
    delEdge = false;
    deleteEdgeStarted = false;
    document.getElementById("DeleteEdge").style.backgroundColor = "#4CAF50";
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
  }
  if (deleteVertex) {
    deleteVertex = false;
    document.getElementById("DeleteVertex").style.backgroundColor = "#4CAF50";
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
  }
  if (moveVertexes){
    moveVertexes = false;
    moveVertexesStarted = false;
    document.getElementById("MoveVertex").style.backgroundColor = "#4CAF50";
    clearCanvas();
    draw_fixed_vertexes(-1);
    drawEdges();
  }
  if (changeValue){
    changeValue = false;
    document.getElementById("ChangeValue").style.backgroundColor = "#4CAF50";
    document.getElementById("Settings").style.height = '350px';
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
