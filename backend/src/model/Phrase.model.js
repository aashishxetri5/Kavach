const mongoose = require("mongoose");

const phraseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  fileId: { type: String, required: true },
  phrase: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true }, // TTL field
});

phraseSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Phrase = mongoose.model("Phrase", phraseSchema);
module.exports = Phrase;
