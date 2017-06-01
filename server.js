const express = require('express');
const app = express();
const http = require('http')
const server = http.Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser')

const defaultStatus = {
  startTime: -1,
  finalTime: -3,
  place: '',
  boardHidden: true,
  rowHidden: true,
  row: {
    name: '',
    goals: [
      {
        name: '',
        class: '',
        extra: ''
      },
      {
        name: '',
        class: '',
        extra: ''
      },
      {
        name: '',
        class: '',
        extra: ''
      },
      {
        name: '',
        class: '',
        extra: ''
      },
      {
        name: '',
        class: '',
        extra: ''
      }
    ]
  },
<<<<<<< HEAD
  board: [],
  sync: {
    board: [],
    colours: [],
    players: [],
    lockout: false
  }
=======
  board: []
>>>>>>> e0cbfd5d09bc33886400bd31594c1d5e9bfafc46
}

const namespaces = {
  row: io.of('/row'),
  board: io.of('/board'),
<<<<<<< HEAD
  timer: io.of('/timer'),
  sync: io.of('/sync')
=======
  timer: io.of('/timer')
>>>>>>> e0cbfd5d09bc33886400bd31594c1d5e9bfafc46
}

let status = JSON.parse(JSON.stringify(defaultStatus));

const regex = /speedrunslive\.com\/tools\/oot-bingo\/?\?mode=normal(?:&amp;|&)seed=([0-9]+)/

function getRaces() {
  return new Promise(resolve => {
    http.get({
      host: 'api.speedrunslive.com',
<<<<<<< HEAD
      path: '/race'
=======
      path: '/races'
>>>>>>> e0cbfd5d09bc33886400bd31594c1d5e9bfafc46
    }, function(res) {
      // Continuously update stream with data
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        resolve(JSON.parse(body));
      });
    });
  });
}

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function getPlaceText(place) {
  switch(place % 10) {
    case 1:
      if (place % 100 === 11) return `${place}th`;
      return `${place}st`
    case 2:
      if (place % 100 === 12) return `${place}th`;
      return `${place}nd`
    case 3:
      if (place % 100 === 13) return `${place}th`;
      return `${place}rd`
    default:
      return `${place}th`
  }
}

function reload() {
  return getRaces().then(srl => {
<<<<<<< HEAD
    const races = srl.races.filter(race => Object.keys(race.entrants).some(entrant => entrant === 'prettybigjoe'));
    if (races.some(race => race.state === 3 && race.entrants.prettybigjoe.time === -3)) {
      status.startTime = race.time * 1000;
      status.finalTime = -1;
      status.place = '';
      namespaces.timer.emit('time', { finalTime: status.finalTime, startTime: status.startTime, place: status.place });
      return;
    }
    if (races.some(race => race.entrants.prettybigjoe.time > 0 && race.time + race.entrants.time < 600)) {
      status.startTime = race.time * 1000;
      status.finalTime = race.entrants.prettybigjoe.time * 1000;
      if (race.entrants.prettybigjoe.place > 9000) status.place = '';
      else status.place = getPlaceText(race.entrants.prettybigjoe.place);
      namespaces.timer.emit('time', { finalTime: status.finalTime, startTime: status.startTime, place: status.place });
      return;
    }
    namespaces.row.emit('hide');
    namespaces.board.emit('hide');
    status = JSON.parse(JSON.stringify(defaultStatus));
    namespaces.timer.emit('time', { finalTime: status.finalTime, startTime: status.startTime, place: status.place });
=======
    for (let race of srl.races) {
      for (let entrant in race.entrants) {
        if (entrant === 'prettybigjoe') {
          status.finalTime = race.entrants[entrant].time * 1000;
          status.startTime = race.time * 1000;
          if (race.entrants[entrant].place > 9000) status.place = '';
          else status.place = getPlaceText(race.entrants[entrant].place)
          if (status.startTime < 0) {
            status = JSON.parse(JSON.stringify(defaultStatus));
            namespaces.row.emit('hide');
            namespaces.board.emit('hide');
          }
          namespaces.timer.emit('time', { finalTime: status.finalTime, startTime: status.startTime, place: status.place })
          return;
        }
      }
    }
    status = JSON.parse(JSON.stringify(defaultStatus));
    namespaces.row.emit('hide');
    namespaces.board.emit('hide');
    namespaces.timer.emit('time', { finalTime: status.finalTime, startTime: status.startTime, place: status.place })
>>>>>>> e0cbfd5d09bc33886400bd31594c1d5e9bfafc46
  }).catch(console.log)
}

app.post('/api/reload', (req, res) => {
  reload().then(() => {
    res.status(200).send();
  })
});

app.post('/api/setrow', (req, res) => {
  status.row = req.body;
  status.boardHidden = true;
  status.rowHidden = false;
  namespaces.board.emit('hide')
  namespaces.row.emit('row', status.row);
  res.status(200).send();
});

app.post('/api/setboard', (req, res) => {
  status.board = req.body;
  status.boardHidden = false;
  namespaces.board.emit('board', status.board);
  res.status(200).send();
});

app.post('/api/setsync', (req, res) => {
  status.sync = req.sync;
  namespaces.sync.emit('sync', status.sync);
  res.status(200).send();
});

app.post('/api/setsynccolours', (req, res) => {
  status.sync.colours = req.colours;
  namespaces.sync.emit('colours', status.sync.colours);
  res.status(200).send();
});

app.post('/api/setsyncplayers', (req, res) => {
  status.sync.players = req.players;
  namespaces.sync.emit('colours', status.sync.players);
  res.status(200).send();
});

app.get('/timer', (req, res) => {
  reload().then(() => {
    res.render('timer', { startTime: status.startTime, finalTime: status.finalTime, place: status.place });
  });
})

app.get('/board', (req, res) => {
  reload().then(() => {
    res.render('board', { board: status.board, hidden: status.boardHidden });
  });
})

app.get('/row', (req, res) => {
  reload().then(() => {
    res.render('row', { row: status.row, hidden: status.rowHidden });
  });
})

<<<<<<< HEAD
app.get('/syncboard', (req, res) => {
  reload().then(() => {
    res.render('syncboard', { board: status.sync.board, colours: status.sync.colours });
  });
})

=======
>>>>>>> e0cbfd5d09bc33886400bd31594c1d5e9bfafc46
server.listen(process.env.PORT || 8082)
