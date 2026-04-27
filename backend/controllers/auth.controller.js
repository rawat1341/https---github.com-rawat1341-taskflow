import User from '../models/user.model.js';
import { signupSchema } from '../utils/validator.js';
import bcrypt from 'bcrypt';

const signup = async (req, res) => {
  // Logic for user signup
  try {
    const parseResult = await signupSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
    }

    const { username, email, password } = parseResult.data;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (error.code === 11000) {
        return res.status(400).json({
          message: `${Object.keys(error.keyValue)[0]} already exists`,
        });
      }
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = await user.getJWT();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie('token', token, cookieOptions);
    res.status(201).json({
      message: 'User created successfully',
      user: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (!(await existingUser.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = await existingUser.getJWT();
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    });
    res.status(200).json({
      message: 'Login successful',
      user: { _id: existingUser._id, username: existingUser.username, email: existingUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    // res.clearCookie('token', null, { expires: new Date(Date.now()) });
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };
    res.clearCookie('token', cookieOptions);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { signup, login, logout };
