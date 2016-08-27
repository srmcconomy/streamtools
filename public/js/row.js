var socket = io('/row')
socket.on('row', data => {
  setRow(data.row);
})

socket.on('hide', () => {
  $('table').addClass('hidden');
})

function setRow(row) {
  $('table').removeClass('hidden');

  $('th').html(row.name);
  for (var i = 0; i < 5; i++) {
    $('#goal' + i).html(row.goals[i].name)
    $('#goal' + i).removeClass();
    $('#goal' + i).addClass(row.goals[i].class)
    $('#goal' + i).append(row.goals[i].extra)
  }
}
