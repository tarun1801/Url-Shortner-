const express = require("express");
const app = express();
const mongoose = require('mongoose');
const shortid = require("shortid");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

let urlArray = [];


app.set("view engine","ejs");
mongoose.connect('mongodb://localhost:27017/url-shortner', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("We are connected to the Database")
});

const urlSchema = new mongoose.Schema({
    fullUrl : {
        type : String,
        reuired : true
    },
    shortUrl : {
        type : String,
        required : true,
        default : shortid.generate
    },
    clicks : {
        type :Number,
        default : 0
    }
  });

  const Url = mongoose.model('Url', urlSchema);



app.get("/",async(req,res)=>{


    urlArray  = await Url.find();
    //console.log(urlArray);

   await res.render("index",{urlArray : urlArray});
})

app.post("/",async(req,res)=>{
   const fullUrlName = req.body.fullUrl 
  await Url.create({fullUrl : fullUrlName})
     
    res.redirect('/');
})


app.get("/:short",async(req,res)=>{
    console.log(req.params.short)
    var foundElement =await Url.findOne ({shortUrl : req.params.short})
  
    if(foundElement == null)
    return res.sendStatus(404);
    
    foundElement.clicks++;
   foundElement.save();
    res.redirect(foundElement.fullUrl)

})




app.listen(3000,()=>{
    console.log("Server listening on the port 3000");
})