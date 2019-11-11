function save() {
  var exportObj = [];
  exportObj.push(IDcount);
  exportObj.push(vertexes);
  var exportName = 'Graph';
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

if (window.File && window.FileReader && window.FileList && window.Blob) {
  function handleJSONDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files;
    for (var i = 0, f; f = files[i]; i++) {

      if (!f.type.match('application/json')) {
        continue;
      }

      var reader = new FileReader();


      reader.onload = (function(theFile) {
        return function(e) {
          var file = JSON.parse(e.target.result);
          IDcount = file[0];
          vertexes = file[1];
          if (vertexes.length > 0) {
            for (let vertex of vertexes){
              var height = document.getElementById("drawingCanvas").height;
              while (vertex.vertex.y > height - 200) {
                document.getElementById("drawingCanvas").height = height + 200;
                height += 200;
              }
            }
            settingVertex = -1;
            clearCanvas();
            draw_fixed_vertexes(-1);
            drawEdges();
          }
        };
      })(f);

      reader.readAsText(f);
    }
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  }


  var dropZone = document.getElementsByTagName('body')[0];
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleJSONDrop, false);


} else {
  alert('The File APIs are not fully supported in this browser.');
}
