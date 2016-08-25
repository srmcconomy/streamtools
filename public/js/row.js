var socket = io('http://streamtools.prettybigjoe.me')
socket.on('status', data => {
  setRow(data.row);
})

function setRow(row) {
  if (row.name === '') {
    $('table').addClass('hidden')
  } else {
    $('table').removeClass('hidden');
  }
  $('th').html(row.name);
  for (var i = 0; i < 5; i++) {
    $('#goal' + i).html(row.goals[i].name)
    $('#goal' + i).removeClass();
    $('#goal' + i).addClass(row.goals[i].class)
    $('#goal' + i).append(row.goals[i].extra)
  }
}
