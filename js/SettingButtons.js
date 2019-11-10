function addVertex() {
  newVertex = !newVertex;
  if (newVertex){
    document.getElementById("AddVertex").style.backgroundColor = "green";
  } else {
    document.getElementById("AddVertex").style.backgroundColor = "whitesmoke";
  }
}
