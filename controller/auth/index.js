// controller/auth.js
import axios from "axios";
import * as fn from "../../functions/index.js";

const signup = async (req, res) => {
  const { email, password, username } = req.body;

  const url = `https://${process.env.ORACLE}/api/account/create`;

  console.log(url);

  try {
    await axios.post(url, {
      uid: fn.utility.generateUID(),
      username,
      email,
      password,
    });
  } catch (error) {
    console.error(error);
  }

  res.json({ email, username });
};

const signin = (req, res) => {
  const { email, password } = req.body;

  res.json({ email });
};

export { signup, signin };
