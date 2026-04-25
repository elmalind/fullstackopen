const mongoose = require("mongoose");

const url = process.env.MONGODB_URI || "mongodb://localhost:27017/phonebook";

mongoose.set("strictQuery", false);
mongoose.connect(url).then(() => {
  console.log("connected to MongoDB");
}).catch((err) => {
  console.error("error connecting to MongoDB:", err.message);
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
