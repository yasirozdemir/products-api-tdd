import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import server from "./server.js";

const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  server.listen(port, () => {
    console.table(listEndpoints(server));
  });
});
