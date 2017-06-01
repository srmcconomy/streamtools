const c = ['orange', 'red', 'blue', 'green', 'purple'];

var socket = io('/sync')
socket.on('sync', data => {
  setBoard(data.board);
  setColours(data.colours);
});

socket.on('colours', data => {
  setColours(data);
});

function setBoard(board) {
  for (var i = 0; i < 25; i++) {
    $('#square' + i + ' div div').html(board[i])
  }
}

function setColours(allColours) {
  allColours.forEach((colours, i) => {
    c.forEach(colour => {
      const el = document.getElementById(`square${i}`);
      if (colours.includes(colour)) el.classList.add(colour);
      else el.classList.remove(colour);
    });
  });
}
