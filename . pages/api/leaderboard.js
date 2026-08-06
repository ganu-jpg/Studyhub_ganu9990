import { connectToDatabase } from '../../lib/mongodb';
import StudySession from '../../models/StudySession';

export default async function handler(req, res) {
  await connectToDatabase();

  try {
    const leaderboard = await StudySession.aggregate([
      {
        $group: {
          _id: "$username",
          totalSeconds: { $sum: "$durationSeconds" },
          sessionsCount: { $sum: 1 }
        }
      },
      { $sort: { totalSeconds: -1 } },
      { $limit: 20 }
    ]);

    const formatted = leaderboard.map(item => ({
      username: item._id,
      totalHours: (item.totalSeconds / 3600).toFixed(1),
      sessions: item.sessionsCount
    }));

    res.status(200).json({ success: true, leaderboard: formatted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
