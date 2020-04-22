var bodyParser =require("body-parser"),
mongoose       =require("mongoose"),
express        =require("express"),
app            =express(),
methodOverride =require("method-override");

//app config
mongoose.connect("mongodb://localhost:27017/test", {useNewUrlParser: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//mongoose/model config 
var blogSchema=new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	date:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title:"doggy",
// 	image:"https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
// 	body:"Hello this is a blog post",
// });
//RESTFUL Routes

app.get("/",function(req,res){
	res.redirect("/blogs");
});


app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("Error!!!");
		}else{
			res.render("index.ejs",{blogs:blogs});
		}
	});

});

app.post("/blogs",function(req,res){
		Blog.create(req.body.blog,function(err,newOne){
			if(err){
				console.log(err);
			}else{
				res.redirect("/blogs");	
			}
		});
});

app.get("/blogs/new",function(req,res){
	res.render("new.ejs");
});

app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.send(err);
		}else{
			res.render("show",{blog:foundBlog});
		}
	});
});

app.get("/blogs/show",function(req,res){
	res.render("show");
});

app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
	if(err){
		res.send(err);
	}else{
		res.render("edit",{blog:foundBlog});
	}	
	});
});
app.put("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
		
	});
});
app.listen(3540,function(){
	console.log("Server running!!!!");
});