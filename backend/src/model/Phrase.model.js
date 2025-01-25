const mongoose = require("mongoose");

const phraseSchema = new mongoose.Schema({
  email: { type: String, required: true },
  fileId: { type: String, required: true },
  phrase: { type: String, required: true },
  expiresAt: { type: Date, required: true }, // TTL field
});

phraseSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Phrase = mongoose.model("Phrase", phraseSchema);
module.exports = Phrase;
