const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// create application/json parser
const jsonParser = bodyParser.json()

app.use(cors());

// Send tokens
app.get('/mint-tokens/:address', function (req, res) {
    console.log(`enter mint-tokens: ${req.params.address}`)
    res.status(200)
})

const server = app.listen(8090, function () {
    console.log('listening on 8090');
});
