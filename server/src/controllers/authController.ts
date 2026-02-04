import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import pool from '../config/database'
import { generateToken } from '../utils/jwt'

export const register = async (req: Request, res: Response) => {
  const { email, password, name, targetBandScore } = req.body

  try {
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      'INSERT INTO users (email, name, password_hash, target_band_score) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, target_band_score, created_at',
      [email, name, passwordHash, targetBandScore]
    )

    const user = result.rows[0]
    const token = generateToken(user.id, user.email, user.role)

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        targetBandScore: user.target_band_score,
        createdAt: user.created_at,
      },
      token,
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const result = await pool.query(
      'SELECT id, email, name, password_hash, role, target_band_score, created_at FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = result.rows[0]
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = generateToken(user.id, user.email, user.role)

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        targetBandScore: user.target_band_score,
        createdAt: user.created_at,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
}

export const getCurrentUser = async (req: any, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, role, target_band_score, created_at FROM users WHERE id = $1',
      [req.user.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = result.rows[0]

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      targetBandScore: user.target_band_score,
      createdAt: user.created_at,
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
}