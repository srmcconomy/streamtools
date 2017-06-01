var socket = io('/board')
socket.on('board', data => {
  setBoard(data);
  $('table.bingo').removeClass('hidden')
})

socket.on('hide', () => {
  $('table.bingo').addClass('hidden')
});

function setBoard(board) {
  for (var i = 0; i < 25; i++) {
    $('#square' + i).html(board[i])
  }
}
