const mongoose = require("mongoose");
const { Schema } = mongoose;

const performanceSchema = new Schema({
  piece: { type: String, required: true },
  composer: { type: String, required: true },
  period: { type: String, required: true },
  video_id: { type: Schema.Types.ObjectId, required: true },
  interpretation_score: {type: Number, default: 0},
  difficulty_score: {type: Number, default: 0},
  technical_score: {type: Number, default: 0},
  performer_id: { type: Schema.Types.ObjectId, ref: "User" }
}, {
  timestamps: true
});

module.exports = mongoose.model("Performance", performanceSchema);
