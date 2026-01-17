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
      success: true,
      message: "Account created",
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
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json({
        success: false,
        message: "username or email and password are required",
      });
    }

    // Flexible identifier
    const query = email
      ? { email: email.toLowerCase() }
      : { username: username.toLowerCase() };

    const User = existence.models.User;

    const user = await User.findOne(query).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.json({
      success: true,
      user: {
        uid: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { signup, signin };
