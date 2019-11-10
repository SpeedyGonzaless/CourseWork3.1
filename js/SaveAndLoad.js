function save() {
  // localStorage.setItem('myStorage', JSON.stringify(vertexes));
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
  // Great success!
  function handleJSONDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files;
    // Loop through the FileList and read
    for (var i = 0, f; f = files[i]; i++) {

      // Only process json files.
      if (!f.type.match('application/json')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          var file = JSON.parse(e.target.result);
          IDcount = file[0];
          vertexes = file[1];
          if (vertexes.length > 0) {
            settingVertex = 0;
            clearCanvas();
            draw_fixed_vertexes(vertexes[settingVertex].vertex.id);
            drawEdges();
            drawMenu(vertexes[settingVertex].vertex.x, vertexes[settingVertex].vertex.y, false, false, false);
          }
        };
      })(f);

      reader.readAsText(f);
    }
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  // Setup the dnd listeners.
  var dropZone = document.getElementsByTagName('body')[0];
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleJSONDrop, false);


} else {
  alert('The File APIs are not fully supported in this browser.');
}
