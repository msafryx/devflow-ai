import mongoose from "mongoose";

const StackOverflowSchema = new mongoose.Schema({
  tagFilter: String,
  questionCount: Number,
  avgScore: Number,
  avgAnswers: Number,
  topQuestions: [
    {
      title: String,
      score: Number,
      answers: Number,
      link: String,
    },
  ],
}, { _id: false });

const SnapshotSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
  crypto: Object,
  news: Object,
  community: StackOverflowSchema,
  weather: Object,
  infra: Object,
  aiScore: Number,
});

export default mongoose.model("Snapshot", SnapshotSchema);
