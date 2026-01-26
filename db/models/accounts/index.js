import mongoose from "mongoose";
import { userSchema, clientSchema } from "../../schemas/accounts/index.js";

const User = mongoose.model("User", userSchema);
const Client = mongoose.model("Client", clientSchema);

export default { User, Client };
