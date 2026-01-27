// models/existence/Client.js
import { randomUUID } from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

const clientSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `c_${randomUUID()}`,
    },

    username: { type: String, unique: true, required: true },
    name: String,
    hosts: [String],
    type: String,
    package: String,
    content: {},
    administrators: [
      {
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, default: "owner" },
      },
    ],
  },
  { _id: false, timestamps: true } // 👈 important
);

clientSchema.pre("save", async function (next) {
  if (!this.isModified("administrators")) return next();

  for (const admin of this.administrators) {
    if (admin.password && !admin.password.startsWith("$2b$")) {
      admin.password = await bcrypt.hash(admin.password, SALT_ROUNDS);
    }
  }

  next();
});

clientSchema.methods.compareAdminPassword = async function (
  email,
  candidatePassword
) {
  const admin = this.administrators.find((a) => a.email === email);
  if (!admin) return false;

  return bcrypt.compare(candidatePassword, admin.password);
};

clientSchema.methods.changeAdminPassword = async function (email, newPassword) {
  const admin = this.administrators.find((a) => a.email === email);
  if (!admin) throw new Error("Admin not found");

  admin.password = newPassword;
  await this.save(); // triggers hashing hook
};
export default clientSchema;
