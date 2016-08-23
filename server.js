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
  row: {}
}



let status = defaultStatus;

const regex = /speedrunslive.com\/tools\/oot-bingo\/?\?seed=(\d+)/

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

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/api/reload', (req, res) => {
  getRaces().then(srl => {
    for (let race of srl.races) {
      for (let entrant in race.entrants) {
        if (entrant === 'prettybigjoe') {
          status.finalTime = race.entrants[entrant].time * 1000;
          status.startTime = race.time * 1000;
          let r = regex.exec(race.goal)
          if (r) {
            let seed = +r[1];
            if (status.seed !== seed) {
              status.boardHidden = false;
              status.seed = seed;
            }
          }
          io.emit('status', status);
          res.status(200).send();
          return;
        }
      }
    }
    status = defaultStatus;
    io.emit('status', status);
    res.status(200).send();
  }).catch(console.log)
});

app.post('/api/setrow', (req, res) => {
  status.row = req.body;
  status.boardHidden = true;
  io.emit('status', status);
  res.status(200).send();
});

app.get('/timer', (req, res) => {
  res.render('timer', { startTime: status.startTime, finalTime: status.finalTime });
})

app.get('/board', (req, res) => {
  res.render('board', { seed: status.seed, boardHidden: status.boardHidden });
})

app.get('/row', (req, res) => {
  res.render('row', { row: status.row });
})

server.listen(3000)
