import mongoose from "mongoose";

mongoose.connect("mongodb://localhost/got");
mongoose.Promise = global.Promise;

export default mongoose;
