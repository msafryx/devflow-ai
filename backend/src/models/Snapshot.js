import mongoose from "mongoose";

const StackOverflowSchema = new mongoose.Schema(
  {
    tagFilter: String,
    questionCount: Number,
    avgScore: Number,
  },
  { _id: false }
);

const CryptoSchema = new mongoose.Schema(
  {
    btcPrice: Number,
    btcChange24h: Number,
    trend: String,
  },
  { _id: false }
);

const NewsSchema = new mongoose.Schema(
  {
    sentimentScore: Number,
    sentimentLabel: String,
    topHeadlines: [
      {
        title: String,
        source: String,
        url: String,
      },
    ],
  },
  { _id: false }
);

const WeatherSchema = new mongoose.Schema(
  {
    city: String,
    tempC: Number,
    humidity: Number,
    status: String,
    condition: String,
  },
  { _id: false }
);

const SnapshotSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
  crypto: CryptoSchema,
  news: NewsSchema,
  community: StackOverflowSchema,
  weather: WeatherSchema,
  aiScore: Number,
});

export default mongoose.model("Snapshot", SnapshotSchema);
