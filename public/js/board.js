var socket = io('http://streamtools.prettybigjoe.me')
socket.on('status', data => {
  setSeed(data.seed);
  if (data.boardHidden) {
    $('table.bingo').addClass('hidden')
  } else {
    $('table.bingo').removeClass('hidden')
  }
})

window.onload = function() {
  setSeed($('table.bingo').data('seed'))
}

function setSeed(seed) {
  seed = ''+seed;
  var board = ootBingoGenerator(bingoList, { seed });
  for (var i = 1; i <= 25; i++) {
    $('#square' + (i - 1)).html(board[i].name)
  }
}
