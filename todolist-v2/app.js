//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");
mongoose.set('strictQuery', false);
const app = express();

const DB="mongodb+srv://12112211:<Abc@123456>@cluster0.r2dsjdp.mongodb.net/hv?retryWrites=true&w=majority";
const _=require("lodash");
app.set('view engine', 'ejs');  //1

app.use(bodyParser.urlencoded({extended: true})); //1
app.use(express.static("public"));//1

//const items = ["Buy Food", "Cook Food", "Eat Food"];   //1
// const workItems = [];
const mongoDB = "mongodb://127.0.0.1/thapa";
// Wait for database to connect, logging an error if there is a problem 
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log("yes");
}
const assert=require("assert");
const { isReadable } = require("stream");


const itemschema=new mongoose.Schema(
  {
        name:String,

   }
);
const Itemmodel=new mongoose.model("Itemmodel", itemschema); // create the collection 
const item1=new Itemmodel({name:"Welcome to your Today list"});
const item2=new Itemmodel({name:"Hit the + Button to add anew item"});
const item3=new Itemmodel({name:"<-- hit this to delete teh item"});
const defaultitem=[item1, item2, item3];

// item1.save();
// item2.save();
// item3.save();

// Itemmodel.insertMany(defaultitem, function(err)
// {
//     if(err)
//     {
//          console.log("error in inserting ");
//     }
//     else
//      {
//       console.log("efault item are added to the database successfully");
//      }
// });
const day = date.getDate();


app.get("/", function(req, res) {



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
        //res.render("list", {listTitle: day, newListItems: founditems});
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

 app.get("/:customlistname", function(req,res)
 {
      const customlistname=req.params.customlistname;
      //const customlistname=_.capitalize(req.params.customlistname); can use the lodash also 

    
      // const list=new Custommodel(
      //   {
      //         name:customlistname,
      //         items:defaultitem
      //   }
      // );
      // list.save();

 
      Custommodel.findOne({name:customlistname}, function(err, results)        // return object
      {
                  if(!err)
                  {
                    if(!results)
                    {
                         //console.log("do not exist"); create the new one
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
                         // console.log("exits"); show the existing list
                         res.render("list", {listTitle:customlistname, newListItems:results.items});
                    }
                  }
      });


 });

app.post("/", function(req, res){

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
                         //item.save();
                         res.redirect("/"+listname);
                      }
                      else
                      {
                        console.log(err);
                      }
         });

  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

app.post("/delete", function(req,res){

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

















