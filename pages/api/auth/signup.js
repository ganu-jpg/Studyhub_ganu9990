import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  await connectToDatabase();

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const cleanUsername = username.replace(/^@/, '').toLowerCase();
  const isAdmin = cleanUsername === 'krushna' || cleanUsername === 'ganeshknikam1324';

  const user = await User.create({
    username,
    password: hashedPassword,
    role: isAdmin ? 'admin' : 'user'
  });

  return res.status(201).json({ 
    success: true, 
    message: 'User registered successfully!', 
    role: user.role 
  });
}
