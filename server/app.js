var express = require('express');
var app = express();
var path = require('path');
var servkey = require('../servicekeybp/app.js')


app.use(express.static(__dirname+'/../app'))

app.get('/', function(req,res){
    res.render('index')
})
app.get('/auth/callback',function(req,res){
    res.redirect('/')
})

app.put('/servicekey',function(req,response){
    //get the servicekey and return it to page
    servkey.getToken(function(err,res){
        //console.log(res);
        response.send(res)
    })
})

app.listen(3000)
console.log('listening on 3000')