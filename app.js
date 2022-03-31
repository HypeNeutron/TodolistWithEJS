const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");
const { ObjectId } = require("mongodb");
const _ = require("lodash");
const date = require("./date");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const dbName = "todosListDB";
let initialItems = [{ name: "Fruit" }, { name: "Buy food" }];

// listen server-----------------------------------
app.listen(process.env.PORT || 3000);

app.get("/about", function (_, res) {
   res.render("pages/about");
});

// get index request ejs-------------------------
app.get("/", async function (_, res) {
   const collect = await db.SLcollectName(dbName, "todosList");
   const all = collect.find();
   const result = await all.toArray();
   if (result.length === 0) {
      await collect.insertMany(initialItems);
      res.redirect("/");
   } else {
      res.render("pages/todoList", {
         listTitle: date.getDate(),
         newListItems: result,
      });
   }
});

//get dynamic request ejs------------------------
app.get("/:paramName", async function (req, res) {
   const capParam = _.capitalize(req.params.paramName);

   await db.createCollection(dbName, capParam);

   const collect = await db.SLcollectName(dbName, capParam);
   const all = collect.find();
   const result = await all.toArray();
   if (result.length === 0) {
      await collect.insertMany(initialItems);
      res.redirect("/" + capParam);
   } else {
      res.render("pages/todoList", {
         listTitle: capParam,
         newListItems: result,
      });
   }
});

function linkParam(param) {
   let link = "/" + param;
   let paramName = param;

   if (/^Today/i.test(param)) {
      paramName = "todosList";
      link = "/";
   }
   return { link, paramName };
}

// insert List as params--------
app.post("/:paramName", async function (req, res) {
   const capParam = _.capitalize(req.params.paramName);
   const { link, paramName } = linkParam(capParam);

   const collect = await db.SLcollectName(dbName, paramName);
   try {
      collect.insertOne({ name: _.capitalize(req.body.addList) });
      res.redirect(link);
   } catch (error) {
      alert(`wrong ${error} try again!`);
      res.redirect(link);
   }
});

// delete List as params-----------
app.post("/delete/:paramName", async function (req, res) {
   const capParam = _.capitalize(req.params.paramName);
   const checkedID = req.body.done;
   const { link, paramName } = linkParam(capParam);

   const collect = await db.SLcollectName(dbName, paramName);
   collect.findOneAndDelete({ _id: ObjectId(checkedID) }, function (err) {
      if (err) {
         throw new Error(error);
      } else {
         res.redirect(link);
      }
   });
});
