const mongoose = require("mongoose");
const app = require("./app");
const config = require("./utils/config");

mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connecting to MongoDB:", error.message);
  });

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
