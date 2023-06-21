const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const wikiSchema = {
    title:String,
    content:String
}

const Article = mongoose.model("article",wikiSchema);

app.route("/articles")

.get(function(req,res){
    Article.find().then(function(foundArticle){res.send(foundArticle);}).catch(function(err){res.send(err);});
})

.post(function(req,res){
   
    const newaAticle = new Article({
        title:req.body.title,
        content:req.body.content
    
    })
    
    newaAticle.save().then(function(){console.log("submitted sucessfully");}).catch(function(){console.log(err);});
})

.delete(function(req,res){
    Article.deleteMany().then(function(){console.log("deleted sucessfully");}).catch(function(){console.log(err);});
});

/////Request targeting specific articles/////

app.route("/articles/:articleTitle")

.get(function(req,res){
    
    Article.findOne({title:req.params.articleTitle}).then(function(foundArticle){
        res.send(foundArticle)
    }).catch(function(err){console.log(err);})
})

// .put(function(req,res){
//     Article.update(
//         {title:req.params.articleTitle},
//         {title:req.body.title,content:req.body.content},
//         {overwrite:true}).then(function(){res.send("Succesfully")}).catch(function(err){console.log(err);
//     })
    
.put(function(req,res){
    Article.updateOne({title:req.params.articleTitle},
                    {title:req.body.title,content:req.body.content}).then(function(){res.send("Successfully updated ")}).catch(function(err){res.send(err)})
})

.patch(function(req,res){
    Article.updateOne({title:req.params.articleTitle},
                        {$set:req.body}).then(function(){res.send("Successfully updated the article") }).catch(function(err){res.send(err)})
})


.delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle}).then(function(){res.send("Successfully deleted the article") }).catch(function(err){res.send(err)})
});


app.listen(process.env.PORT || 3000 ,function(){
    console.log("Server is sucessfully started at port 3000");
})