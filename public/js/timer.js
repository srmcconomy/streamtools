
var socket = io('/timer')
socket.on('time', data => {
  var placeClass = ''
  switch(data.place) {
    case '1st':
      placeClass = 'gold'
      break;
    case '2nd':
      placeClass = 'silver'
      break;
    case '3rd':
      placeClass = 'bronze'
      break;
    case '':
      placeClass = 'hidden'
      break;
  }
  document.getElementsByClassName('place')[0].innerHTML = data.place;
  document.getElementsByClassName('place')[0].className = 'place ' + placeClass
  if (data.finalTime > 0) {
    ended(data.finalTime);
  } else if (data.startTime > 0) {
    loaded(data.startTime);
  } else {
    reset();
  }
})


var s = 1000;
var m = 60 * s;
var h = 60 * m;
var int = null;

function reset() {
  clearInterval(int);
  document.getElementsByClassName('seconds')[0].innerHTML = '00';
  document.getElementsByClassName('minutes')[0].innerHTML = '0';
  document.getElementsByClassName('hours')[0].innerHTML = '';
}

function loaded(startTime) {
  var timer = document.getElementsByClassName('timer')[0];
  if (timer.classList.contains('done')) timer.classList.remove('done')
  clearInterval(int);
  int = setInterval(function() {
    var time = Date.now();
    var interval = time - startTime;
    var t = ~~((interval % m) / s);
    document.getElementsByClassName('seconds')[0].innerHTML = (t < 10 ? '0' : '') + t;
    var t = ~~((interval % h) / m);
    if (interval >= h) {
      document.getElementsByClassName('minutes')[0].innerHTML = (t < 10 ? '0' : '') + t;
      var t = ~~(interval / h);
      document.getElementsByClassName('hours')[0].innerHTML = t;
    } else {
      document.getElementsByClassName('minutes')[0].innerHTML = t;
      document.getElementsByClassName('hours')[0].innerHTML = '';
    }
  }, 1000)
}

function ended(time) {
  var timer = document.getElementsByClassName('timer')[0];
  if (!timer.classList.contains('done')) timer.classList.add('done');
  clearInterval(int);
  var interval = time;
  var t = ~~((interval % m) / s);
  document.getElementsByClassName('seconds')[0].innerHTML = (t < 10 ? '0' : '') + t;
  var t = ~~((interval % h) / m);
  if (interval >= h) {
    document.getElementsByClassName('minutes')[0].innerHTML = (t < 10 ? '0' : '') + t;
    var t = ~~(interval / h);
    document.getElementsByClassName('hours')[0].innerHTML = t;
  } else {
    document.getElementsByClassName('minutes')[0].innerHTML = t;
  }
}

window.onload = function() {
  var timer = document.getElementsByClassName('timer')[0];
  if (timer.dataset.finaltime > 0) {
    ended(timer.dataset.finaltime);
  } else if (timer.dataset.starttime > 0) {
    loaded(timer.dataset.starttime)
  }
}
