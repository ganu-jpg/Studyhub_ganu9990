import { connectToDatabase } from '../../lib/mongodb';
import User from '../../models/User';
import StudySession from '../../models/StudySession';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    // GET = Get user's total study time
    if (req.method === 'GET') {
      const username = String(req.query.username || '')
        .replace(/^@/, '')
        .trim()
        .toLowerCase();

      if (!username) {
        return res.status(400).json({
          success: false,
          message: 'Username is required'
        });
      }

      const user = await User.findOne({
        username
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const result = await StudySession.aggregate([
        {
          $match: {
            userId: user._id
          }
        },
        {
          $group: {
            _id: null,
            totalSeconds: {
              $sum: '$durationSeconds'
            },
            sessions: {
              $sum: 1
            }
          }
        }
      ]);

      const stats = result[0] || {
        totalSeconds: 0,
        sessions: 0
      };

      return res.status(200).json({
        success: true,
        totalSeconds: stats.totalSeconds,
        sessions: stats.sessions
      });
    }

    // POST = Save a completed study session
    if (req.method === 'POST') {
      const {
        username,
        durationSeconds
      } = req.body;

      const cleanUsername = String(username || '')
        .replace(/^@/, '')
        .trim()
        .toLowerCase();

      const duration = Number(durationSeconds);

      if (!cleanUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username is required'
        });
      }

      if (
        !Number.isInteger(duration) ||
        duration < 1
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid study duration'
        });
      }

      // Don't allow an accidentally huge session.
      if (duration > 24 * 60 * 60) {
        return res.status(400).json({
          success: false,
          message: 'Study session is too long'
        });
      }

      const user = await User.findOne({
        username: cleanUsername
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const session = await StudySession.create({
        userId: user._id,
        username: user.username,
        durationSeconds: duration
      });

      return res.status(201).json({
        success: true,
        sessionId: session._id,
        durationSeconds: session.durationSeconds
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });

  } catch (error) {
    console.error('Study API error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}
