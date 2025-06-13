import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: "24h" },
    },
  },
);

export const BlacklistToken = mongoose.model(
  "BlacklistToken",
  blacklistTokenSchema
);
