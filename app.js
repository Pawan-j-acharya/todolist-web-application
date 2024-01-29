const express = require('express')

const bodyParser = require('body-parser')

// const date = require( __dirname + '/date.js')

const mongoose = require("mongoose");

const _ = require("lodash")

const app = express();

app.set( 'view engine' , 'ejs')

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"))

mongoose.connect("mongodb+srv://db-admin:admin-2001@mongo-demo-cluster.2srsv3l.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema({
    name : String
})

const Item = mongoose.model("Item" , itemsSchema);

const item1 = new Item({
    name : "Welcome to your todolist"
})

const item2 = new Item({
    name : "hit the + button to add a new item"
})

const item3 = new Item({
    name : "Click on checkbox <-- to mark as done"
})

const deafultItems = [item1,item2,item3]
//New Schema for custom list

const listSchema = {
    name: String,
    items : [itemsSchema]
}

const List = mongoose.model("List",listSchema)










// const today = new Date();
// const currentDay = today.getDay();
// let day="";
// let  item="";
// // let items = ["Learn MERN ","Learn DSA","Apply for jobs"];
// let workItem = [];

app.get("/",function(req,res){

    Item.find()
    .then(items =>{

        if(items.length===0)
        {
            Item.insertMany(deafultItems)
              .then(fruit =>{
                      console.log("items has been successfully added default items to the  todolistDB")
              })
           .catch(err =>{
                    console.log(err)
             })
             res.redirect("/");

        }else{
            res.render("lists" ,{listTitle : "Today" , newItems : items });

        }
        
    })
    .catch(err =>{
        console.log(err);
    })
   
    
   
})

app.get("/:customListName",function(req,res){

    const customListName = _.capitalize([req.params.customListName]);
    // const customListName = req.params.customListName;

    List.findOne({name : customListName})
        .then(foundList =>{
            if(!foundList)
           {
            const list = new List({
                name: customListName,
                items : deafultItems
            })
        
            list.save();
            res.redirect("/"+customListName)
           }
           else{
            res.render("lists", {listTitle : foundList.name , newItems : foundList.items })
           }
           

        })
    
})



app.post("/",function(req,res){

    const item = req.body.newItem;
    const listName = req.body.list;

    console.log(item,listName);

   
         const newItem = new Item({
            name: item
        })

        if(listName === "Today")
        {
            newItem.save();
            res.redirect("/");
        }
        else
        {
            List.findOne({name:listName})
                .then((foundList)=>{
                    foundList.items.push(newItem);
                    foundList.save();
                    console.log("Enter the findOne function")
                    res.redirect("/"+ listName)
                })
        }
        
   
   
})



app.post("/delete",function(req,res){

    const itemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today")
    {

        Item.findByIdAndDelete(itemId)
        .then(data =>{
            console.log("Item was successfully deleted!");
            res.redirect("/")   
        })
        .catch(err=>{
            console.log(err);
        })


    }
    else
    {

        List.findOneAndUpdate({ name : listName },{$pull : { items : {_id : itemId}}})
            .then(()=>{
                res.redirect("/"+listName);
            })

    }

    
})



app.listen(3000,function(){
    console.log("Server is running on port 3000")
})