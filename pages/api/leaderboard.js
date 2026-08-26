import { connectToDatabase } from '../../lib/mongodb';
import StudySession from '../../models/StudySession';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    await connectToDatabase();

    const leaderboard = await StudySession.aggregate([
      {
        $group: {
          _id: '$username',
          totalSeconds: {
            $sum: '$durationSeconds'
          },
          sessions: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          totalSeconds: -1
        }
      },
      {
        $limit: 50
      }
    ]);

    const formatted = leaderboard.map((user, index) => ({
      rank: index + 1,
      username: user._id,
      totalSeconds: user.totalSeconds,
      sessions: user.sessions
    }));

    return res.status(200).json({
      success: true,
      leaderboard: formatted
    });

  } catch (error) {
    console.error('Leaderboard error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load leaderboard'
    });
  }
}
