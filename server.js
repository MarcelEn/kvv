var KvvConnectorClass = require("./KvvConnector");
var KvvConnector = new KvvConnectorClass();

var express = require('express')
var app = express()

app.get('/searchByName/:name', function (req, res) {
    KvvConnector.searchByName(req.params.name)
        .then(response => res.json(response.data))
        .catch(e => res.sendStatus(e.response.status))
})

app.get('/getStartsOfStopId/:id', function (req, res) {
    KvvConnector.getStartsOfStopId(req.params.id)
        .then(response => res.json(response.data))
        .catch(e => res.sendStatus(e.response.status))
})

app.use(express.static("./build"))

app.use((req, res) => { res.sendStatus(404) })

app.listen(3000)