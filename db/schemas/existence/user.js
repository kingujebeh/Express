// models/existence/Account.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // UID (e.g. generated uuid / nanoid)
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
      first: {
        type: String,
        required: true,
        trim: true,
      },
      middle: {
        type: String,
        trim: true,
        default: "",
      },
      last: {
        type: String,
        required: true,
        trim: true,
      },
      titles: [
        {
          type: String, // e.g. "Dr", "Engr", "Prof"
          trim: true,
        },
      ],
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
      select: false, // never returned by default
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
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
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
