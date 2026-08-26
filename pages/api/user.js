import { connectToDatabase } from '../../lib/mongodb';
import User from '../../models/User';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
    }

    const username = String(
      req.body?.username || ''
    )
      .replace(/^@/, '')
      .trim()
      .toLowerCase();

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    // Find existing user
    let user = await User.findOne({
      username
    });

    // Create user if they don't exist
    if (!user) {
      user = await User.create({
        username,
        displayName: username
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName
      }
    });

  } catch (error) {
    console.error('User API error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}
