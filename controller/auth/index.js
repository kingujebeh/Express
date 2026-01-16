import { randomUUID } from "crypto";
import { existence } from "../../db/index.js";
import { emailToUsername } from "../../functions/index.js";

const generateUniqueUsername = async (baseUsername) => {
  let username = baseUsername;
  let exists = true;

  while (exists) {
    exists = await existence.models.User.exists({ username });

    if (exists) {
      const suffix = Math.floor(1000 + Math.random() * 9000);
      username = `${baseUsername}${suffix}`;
    }
  }

  return username;
};

const signup = async (req, res) => {
  try {
    let { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    // Base username
    if (!username) {
      username = emailToUsername(email);
    }

    // Ensure uniqueness
    username = await generateUniqueUsername(username);

    // 32-char UID (no dashes)
    const uid = randomUUID().replace(/-/g, "");

    const user = await existence.models.User.create({
      _id: uid,
      username,
      email,
      password,
    });

    res.status(201).json({
      uid: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({ message: "Signup failed" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  res.json({ email });
};

export { signup, signin };
