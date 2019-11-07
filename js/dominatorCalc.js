dominatorIndex = 1;
function culcDominator() {
  startTreeTravel();
  startFindSemi();
  startFindDomi();
}

function clearDominator() {
  for (let i=0; i<vertexes.length; i++){
    vertexes[i].vertex.semi = -1;
    vertexes[i].vertex.dominatorId = 0;
    unsetVertexes();
  }
}

function unsetVertexes() {
  for(let i=0; i<vertexes.length; i++){
    vertexes[i].vertex.flag = false;
  }
}

function startTreeTravel() {
  dominatorIndex = 1;
  unsetVertexes();
  for(let i=0; i<vertexes.length; i++){
    if(vertexes[i].vertex.parents.length == 0) {
      treeTravel(i);
    }
  }
}

function treeTravel(vertexID) {
  vertexes[vertexID].vertex.flag = true;
  vertexes[vertexID].vertex.dominatorId = dominatorIndex;
  dominatorIndex++;
  for (let i=0; i<vertexes[vertexID].vertex.children.length; i++){
    var tempID = vertexes[vertexID].vertex.children[i];
    var tempVertex = vertexes[getVertexByID(tempID)];
    if(!tempVertex.vertex.flag){
      treeTravel(getVertexByID(tempID), dominatorIndex);
    }
  }
}

function startFindSemi() {
  for(let i=0; i<vertexes.length; i++){
    unsetVertexes();
    findSemi(i,i);
  }
}

function findSemi(it, node) {
  if (vertexes[it].vertex.flag)
    return;
  vertexes[it].vertex.flag = true;
  if (vertexes[it].vertex.dominatorId < vertexes[node].vertex.dominatorId){
    if (vertexes[node].vertex.semi == -1 ||
      vertexes[it].vertex.dominatorId < vertexes[vertexes[node].vertex.semi].vertex.dominatorId) {
      vertexes[node].vertex.semi = it;
      return;
    }
  }
  for (let i=0; i<vertexes[it].vertex.parents.length; i++){
    findSemi(getVertexByID(vertexes[it].vertex.parents[i]), node);
  }
}

function startFindDomi() {
  for(var i=0; i<vertexes.length; i++){
    if (vertexes[i].vertex.semi != -1) {
      findDomi(vertexes[i].vertex.semi, i);
    }
  }
}

function findDomi(from, to) {
  var res = false;
  if (from == to){
    return true;
  }
  for (let i=0; i<vertexes[from].vertex.children.length; i++){
    var temp_index = getVertexByID(vertexes[from].vertex.children[i])
    if(findDomi(temp_index, to)){
      res = true;
      if (vertexes[temp_index].vertex.semi<vertexes[to].vertex.semi){
        vertexes[to].vertex.semi = vertexes[temp_index].vertex.semi;
      }
    }
  }
  return res;
}
