//jshint esversion:6
// adding raiway
const express = require("express");
const bodyParser = require("body-parser");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
mongoose.set('strictQuery', false);
const app = express();
const DB="mongodb+srv://hs1957490:Nishu%402001@cluster0.qhlqz6y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const _=require("lodash");
app.set('view engine', 'ejs');  //1
app.use(bodyParser.urlencoded({extended: true})); //1
app.use(express.static("public"));//1
const mongoDB = "mongodb://127.0.0.1/thapa"; 
dotenv.config();
const PORT=process.env.PORT || 3000;
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(DB);
  console.log("yes");
}
const assert=require("assert");
const { isReadable } = require("stream");

const itemschema=new mongoose.Schema({
        name:String,
   }
);
const Itemmodel=new mongoose.model("Itemmodel", itemschema); // create the collection 
const item1=new Itemmodel({name:"Welcome to your Today list"});
const item2=new Itemmodel({name:"Hit the + Button to add anew item"});
const item3=new Itemmodel({name:"<-- hit this to delete teh item"});
const defaultitem=[item1, item2, item3];
const day = getDate();
const router=express.Router();
router.get("/testing", function(req, res) {
  res.send("hello");
});
router.get("/", function(req, res) {
Itemmodel.find({}, function(err, founditems){
  if(err)
  {
    console.log("error");
  }
  else
  {
      if(founditems.length===0)
      {
        Itemmodel.insertMany(defaultitem, function(err)
        {
            if(err)
            {
                // console.log("error in inserting ");
            }
            else
             {
               console.log("default item are added to the database successfully");
             }
        });
          res.redirect("/");
      }
      else
      {
        res.render("list", {listTitle: day, newListItems: founditems});
      }
  }
});
 });
 const customschema=new mongoose.Schema(
  {
    name:String ,
    items:[itemschema]
  }
 );
 const Custommodel=new mongoose.model("Custommodel", customschema);
 router.get("/:customlistname", function(req,res)
 {
      const customlistname=req.params.customlistname;
      Custommodel.findOne({name:customlistname}, function(err, results)        // return object
      {
                  if(!err)
                  {
                    if(!results)
                    {
                         const list=new Custommodel(
                          {
                                name:customlistname,
                                items:defaultitem
                          }
                        );
                        list.save();
                        res.redirect("/"+customlistname);
                    }
                    else
                    {
                         res.render("list", {listTitle:customlistname, newListItems:results.items});
                    }
                  }
      });
 });

router.post("/", function(req, res){
  const itemname = req.body.newItem;
  const listname=req.body.list;
  const item=new Itemmodel({
       name:itemname
  });
  if(listname==day)
  {
    item.save();
    res.redirect("/");
  }
  else
  {
         Custommodel.findOne({name:listname}, function(err, foundlist)
         {
                      if(!err)
                      {
                        foundlist.items.push(item);
                         foundlist.save();
                         res.redirect("/"+listname);
                      }
                      else
                      {
                        console.log(err);
                      }
         });
  }
});

router.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

router.get("/about", function(req, res){
  res.render("about");
});

app.listen(PORT,"0.0.0.0", () => {
  console.log(`server is running on port ${PORT}`);
})

router.post("/delete", function(req,res){

    const id=req.body.checkbox;
    const listname=req.body.listname;
    if(listname==day)
    {
                Itemmodel.findByIdAndRemove(id, function(err)           // callback is nesccesary to execute 
                {
                    if(err)
                    {
                      console.log(err);
                    }
                    else
                    {
                        console.log("deleted item succesfully");
                        res.redirect("/");
                    }
                });
   }
    else
   {
         Custommodel.findOneAndUpdate({name:listname}, {$pull:{items:{_id:id}}}, function(err, foundlist)
         {  
                 if(!err)
                 {
                    res.redirect("/"+listname);
                 }
                 else
                 {
                  console.log("error in deleting from the cisto, list ");
                 }

         } );
    }
});

app.use("/", router);
function getDate () {

  const today = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  return today.toLocaleDateString("en-US", options);

};

function getDay() {

  const today = new Date();

  const options = {
    weekday: "long"
  };

  return today.toLocaleDateString("en-US", options);

};
















































































































































































































































































// const express=require("express");
// const app=express();
// const bodyparser=require("body-parser");
// app.set('view engine', 'ejs');
// var items=["buy milk" , "cook food", "eat food"];
// var workitems=[];
// //acquire the date moduke
// const date=require(__dirname+"/date.js");


// ******* setting databse  *************//
// const mongoose=require("mongoose");
// main().catch(err=>console.log(err));
// async function main()
// {
//     await mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");
// }
// mongoose.set('strictQuery', false);


// ***** settting database ****************//

// const itemschema=new mongoose.Schema(
//   {
//     name:String
//   }
// );
// const Item=new mongoose.model("Item", itemschema);
// const item1=new Item({name:"buy milk"});
// const item2=new Item({name:"cook  food"});
// const item3=new Item({name:"eat food"});
// const deafultitem=[item1,item2,item3];
// // Item.insertMany(deafultitem,function(err)
// {
//     if(err)
//     {
//       console.log(err);
//     }
//     else
//     {
//       console.log("successfully saved t default item o the database");
//     }
// });




// app.use(bodyparser.urlencoded({extended:true}));
// app.use(express.static("public"));



// app.get("/", function(req,res)
// {
      
//         var day=date.getdate();
      
//       //  res.render("list", {listtitle:day, works:items});
//       Item.find({}, function(err,founditems)
//       {
//           if(err)
//           {
//             console.log(err);
//           }
//           else
//           {
//                   if(founditems.length==0)
//                   {
//                             Item.insertMany(deafultitem,function(err)
//                             {
//                                   if(err)
//                                   {
//                                     console.log(err);
//                                   }
//                                   else
//                                   {
//                                     console.log("added succesfully deafult item to empty found list");
//                                   }
//                             });
//                             res.redirect("/");
//                   }
//                   else
//                   {
//                     res.render("list", {listtitle:day, works:founditems});
//                   }
//           }
//       })

// });

// app.get("/work", function(req,res)
// {
     
//     res.render("work", {listtitle:"work List", works:workitems});


// });
// app.get("/about", function(req, res)
// {
//   res.render("about");


// });

// app.post("/", function(req,res)
// {

//     var item=req.body.newitem;
    
//     if(req.body.list==="Work")
//     {
//         workitems.push(item);
//         res.redirect("/work");
//     }
//     else                          another concept to submit the button as well 
//     {
//         items.push(item);
//         res.redirect("/");
//     }

// });
// app.post("/", function(req,res)
// {
//   var itemname=req.body.item;
//   const temp=new Item({name:itemname});
//   temp.save();
                                       
//   res.redirect("/");

// });
// app.post("/work", function(req, res)
// {
//   var newitem=req.body.item;
//   workitems.push(newitem);
//   res.redirect("/work");

// });
// app.post("/delete", function(req,res)
// {
//             console.log(req.body);
// });

// app.listen(3000, function()
// {
//     console.log("server is running at 3000 port");

// })

















