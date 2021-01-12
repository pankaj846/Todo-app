const path = require("path");
const express = require("express");
const hbs = require('hbs');
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
const static_path = path.join(__dirname, "./public");
const template_path = path.join(__dirname, "./templates/views");
const partials_path = path.join(__dirname, "./templates/partials");

app.set('view engine', 'hbs');
app.set("views", template_path); //change the name of view folder
hbs.registerPartials(partials_path);
app.use(express.static(static_path));

mongoose.connect("mongodb+srv://pankaj:9811128043@cluster0.iqldc.mongodb.net/TodoListDB", { useNewUrlParser: true });

// schema creation
const itemsSchema = {
  name: String
};

// collection creation
const Item = mongoose.model("Item", itemsSchema);

app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    res.render("list", { listTitle: "Today Task", newListItems: foundItems });
  });
});

app.post("/", (req, res) => {

  const itemName = req.body.newItem;

  if (itemName == "") res.redirect("/");

  else {
    // create document
    const item = new Item({
      name: itemName
    });

    // insert item in document
    item.save();
    res.redirect("/");
  }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, (err) => {
    if (!err) {
      console.log("Successfully deleted.");
      res.redirect("/");
    }
    else {
      console.log(err);
    }
  });

});

app.listen(port, () => {
  console.log(`listening to the port no at ${port}`);
})
