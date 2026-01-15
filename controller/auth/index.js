import { existence } from "../../db/index.js";

const signup = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const profile = await existence.models.Profile.create({
      email,
      password,
      username,
    });

    await profile.save();

    console.log("Profile Saved", profile);
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
