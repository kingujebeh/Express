// models/existence/Account.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    name: {
      first: { type: String, trim: true, default: "" },
      middle: { type: String, trim: true, default: "" },
      last: { type: String, trim: true, default: "" },
      titles: [{ type: String, trim: true }],
    },

    /* ---------------------------
     * Sex
     * --------------------------- */
    sex: {
      type: String,
      enum: ["male", "female", "not specified"],
      default: "not specified",
      lowercase: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* ---------------------------
 * Hooks
 * --------------------------- */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

/* ---------------------------
 * Methods
 * --------------------------- */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/* ---------------------------
 * Virtuals (optional, useful)
 * --------------------------- */
userSchema.virtual("fullname").get(function () {
  return [
    ...this.name.titles,
    this.name.first,
    this.name.middle,
    this.name.last,
  ]
    .filter(Boolean)
    .join(" ");
});

export default userSchema;
