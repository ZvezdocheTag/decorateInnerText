
var express = require('express');
var path = require('path');
var request = require('superagent');

var app = express();

var PORT = 8080;

app.use(express.static(__dirname + '/build')); // @TODO replace with your bundle folder

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/build/index.html')); // @TODO replace with your index.html path
});
app.get('/root', function(req, res) {
    res.send('HOHOHO')
})

app.get('/doc', function(req, res) {
    console.log("Got request: ", req.query);
    request.get("https://ktbookva.herokuapp.com/pxy?url=https://habrahabr.ru/post/259625/")
        .set("Cookie", "auth=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU5NTdlMDJlMWM5ZWQ0MDAwNDkxZjdjMCIsImlhdCI6MTUwMDIwNDgyMH0.6TVPOIEan56s77XwK1M5YGcVYZnYTxfCRPRFh_d5dYc")
        .then((resp) => {
            res.json({ doc: resp.text })
        })
        .catch((err) => {console.log(err)})
});

app.listen(PORT, function(error){
    if (error) throw error;
    console.log("Express server listening on port", PORT);
});
