//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/articles");

const articleSchema={
  title:String,
  content:String
};
const Article=mongoose.model("Article",articleSchema);

app.get("/articles",function(req,res)
{
  Article.find(function(err,foundArticle)
{
  if(!err)
  {
    res.send(foundArticle);
  }
  else{
    res.send(err);
  }
});
});
app.post("/articles",function(req,res)
{

  const newArticle=new Article({
    title:req.body.title,
    content:req.body.content

  })
  newArticle.save(function(err)
{
  if(!err)
  {
    console.log("successfully added");
  }
  else{
    res.send(err);
  }
})

})

app.delete("/articles",function(req,res)
{
  Article.deleteMany(function(err)
{
  if(!err)
  {
    console.log("Successfully deleted");
  }
  else{
    res.send(err);
  }
})
})

app.get("/articles/:articleName",function(req,res)
{
  Article.findOne({title: req.params.articleName},function(err,foundArticle)
{
  if(foundArticle)
  {
    res.send(foundArticle);
  }
  else{
    res.send("Not exist");
  }
})
})

app.put("/articles/:articleName",function(req,res)
{
  Article.update({
    title:req.params.articleName},{title:req.body.title,content:req.body.content},
    {overwrite:true},function(err)
    {
      if(!err)
      {
        res.send("Successfully Added");
      }



  })
})

app.patch("/articles/:articleName",function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.update(
    {title: articleTitle},
    {content: req.body.newContent},
    function(err){
      if (!err){
        res.send("Successfully updated selected article.");
      } else {
        res.send(err);
      }
    });
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
