import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";



const app = express();
const port = 3000;

    
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("static"));
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to To-Do List!"
});

const item2 = new Item({
    name: "Hit the '+' to add the new item."
});

const item3 = new Item({
    name: "click check box to delete an item."
});

const defaultItems = [item1, item2, item3];




app.get("/", async(req, res) => {
    
     let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
     let today  = new Date();
     let day = today.toLocaleDateString("en-US", options); 

     try {
        const foundItems = await Item.find({});
        if(foundItems.length === 0){
                await Item.insertMany(defaultItems);
                console.log("Successefully saved the database.");
                res.redirect("/");
            }else{
            res.render("today.ejs", {day: day, newListItems: foundItems});
        }
        
     } catch (err) {
        console.log(err);
     }
     
});

app.post("/submit", (req, res) =>{
    const newTask= req.body["task"];
    const item = new Item({
        name:newTask
    });

    item.save();
    res.redirect("/");
});

app.post("/delete", async(req, res) =>{
   const itemId = req.body.checkbox;
   try {
    await Item.findByIdAndDelete(itemId);
    console.log("Successfully deleted the item.");
    res.redirect("/");
   } catch (error) {
    console.log(error);
   }
   
});
5
app.listen(port, ()=>{
    console.log(`The Server has started at port ${port}.`);
});