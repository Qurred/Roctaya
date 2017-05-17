var express = require('express');
var router = express.Router();

router.get('/characters',(req, res, next) =>{
    //Get datas from characters
    var characters = [];
    //forloop
    //Add all characters
    //return characters
    for(var i = 0; i < 10; i++){
        characters.push({
            id: i,
            name: "TEST CHARACTER",
            story: "Liiralaara",
            img_path: "placeholder.png"
        });
    }
    res.send({
        _characters:characters,
        status: 202
    });
});

router.post('/signup',(req,res,next) =>{
    res.status(200).json({
        status: 'ok'
    });
})

router.post('/signin', (req, res, next) =>{
    console.log(req.body.user);
    if(req.body.user && req.body.pword){
        var tmp = {
        user: req.body.user,
        pword: req.body.pword,
        status: "ok",
        message: "Provided all needed data for this test",
        socket: "URL to the socket"
      };
    }else{
        var tmp = {
            user: "",
            pword: "",
            status: "FALSE",
            message:"Didnt provide all needed info"
        }
    }
    console.log(tmp);
    res.send(tmp);
});

module.exports = router;