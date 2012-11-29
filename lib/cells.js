function drawLine(num, c) {
  var result = '';
  if (!c) { c = '='; }
  for (var i=0; i < num+1; i++) {
    result += c;
  }
  return result + "\n";
}
function spaceToEnd(line, end) {
  var spaces = '';
  for (var i=0; i < end - line.length; i++) {
    spaces += ' ';
  }
  return line + spaces;
}
function prepareCells(hSep, vSep, margin) {
  var maxLength = 0;
  var cells = [];
  if (!hSep) { hSep = '='; }
  if (!vSep) { vSep = '|'; }
  if (!margin) { margin = '    '; }
  return {
    add: function(lines){
      var currentCell = [vSep];
      for (var i=0, line; i < lines.length; i++) {
        line = vSep + margin + lines[i] + margin;
        if (line.length > maxLength) {
          maxLength = line.length;
        }
        currentCell.push(line);
      }
      cells.push(currentCell);
    },
    end: function(){
      for (var i=0, cellContent; i < cells.length; i++) {
        cellContent = drawLine(maxLength, hSep);
        for (var j=0; j < cells[i].length; j++) {
          cellContent += spaceToEnd(cells[i][j], maxLength) + vSep + "\n";
        }
        cellContent += spaceToEnd(vSep, maxLength) + vSep + "\n" + drawLine(maxLength, hSep);
        console.log(cellContent);
      }
    }
  };
}

module.exports = prepareCells;