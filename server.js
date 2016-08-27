const express = require('express');
const app = express();
const http = require('http')
const server = http.Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser')

const defaultStatus = {
  startTime: -1,
  finalTime: -3,
  seed: -1,
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
  board: []
}

const namespaces = {
  row: io.of('/row'),
  board: io.of('/board'),
  timer: io.of('/timer')
}

let status = JSON.parse(JSON.stringify(defaultStatus));

const regex = /speedrunslive\.com\/tools\/oot-bingo\/?\?mode=normal(?:&amp;|&)seed=([0-9]+)/

function getRaces() {
  return new Promise(resolve => {
    http.get({
      host: 'api.speedrunslive.com',
      path: '/races'
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

function reload() {
  return getRaces().then(srl => {
    for (let race of srl.races) {
      for (let entrant in race.entrants) {
        if (entrant === 'prettybigjoe') {
          status.finalTime = race.entrants[entrant].time * 1000;
          status.startTime = race.time * 1000;
          if (status.startTime < 0) {
            status = JSON.parse(JSON.stringify(defaultStatus));
            namespaces.row.emit('hide');
            namespaces.board.emit('hide');
          }
          namespaces.timer.emit('time', { finalTime: status.finalTime, startTime: status.startTime })
          res.status(200).send();
          return;
        }
      }
    }
    status = JSON.parse(JSON.stringify(defaultStatus));
    namespaces.row.emit('hide');
    namespaces.board.emit('hide');
    namespaces.timer.emit('time', { finalTime: status.finalTime, startTime: status.startTime })
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

app.get('/timer', (req, res) => {
  reload().then(() => {
    res.render('timer', { startTime: status.startTime, finalTime: status.finalTime });
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

server.listen(process.env.PORT || 8082)
