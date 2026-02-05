import { Request, Response } from 'express'
import pool from '../config/database'

export const getMyEssays = async (req: any, res: Response) => {
  const userId = req.user.userId

  try {
    const result = await pool.query(`
      SELECT 
        e.*,
        ef.id as feedback_id,
        ef.overall_band_score,
        ef.task_achievement,
        ef.coherence,
        ef.lexical_resource,
        ef.grammatical_range,
        ef.comments,
        ef.improved_version,
        ef.completed_at
      FROM essays e
      LEFT JOIN essay_feedback ef ON e.id = ef.essay_id
      WHERE e.user_id = $1
      ORDER BY e.submitted_at DESC
    `, [userId])

    const essays = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      taskType: row.task_type,
      content: row.content,
      status: row.status,
      submittedAt: row.submitted_at,
      paymentId: row.payment_id,
      feedback: row.feedback_id ? {
        id: row.feedback_id,
        essayId: row.id,
        overallBandScore: row.overall_band_score,
        taskAchievement: row.task_achievement,
        coherence: row.coherence,
        lexicalResource: row.lexical_resource,
        grammaticalRange: row.grammatical_range,
        comments: row.comments,
        improvedVersion: row.improved_version,
        completedAt: row.completed_at,
      } : null,
    }))

    res.json(essays)
  } catch (error) {
    console.error('Get essays error:', error)
    res.status(500).json({ error: 'Failed to fetch essays' })
  }
}

export const getEssayById = async (req: any, res: Response) => {
  const { id } = req.params
  const userId = req.user.userId

  try {
    const result = await pool.query(`
      SELECT 
        e.*,
        ef.id as feedback_id,
        ef.overall_band_score,
        ef.task_achievement,
        ef.coherence,
        ef.lexical_resource,
        ef.grammatical_range,
        ef.comments,
        ef.improved_version,
        ef.completed_at,
        u.name as user_name,
        u.email as user_email
      FROM essays e
      LEFT JOIN essay_feedback ef ON e.id = ef.essay_id
      LEFT JOIN users u ON e.user_id = u.id
      WHERE e.id = $1 AND e.user_id = $2
    `, [id, userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Essay not found' })
    }

    const row = result.rows[0]
    const essay = {
      id: row.id,
      userId: row.user_id,
      taskType: row.task_type,
      content: row.content,
      status: row.status,
      submittedAt: row.submitted_at,
      paymentId: row.payment_id,
      user: {
        name: row.user_name,
        email: row.user_email,
      },
      feedback: row.feedback_id ? {
        id: row.feedback_id,
        essayId: row.id,
        overallBandScore: row.overall_band_score,
        taskAchievement: row.task_achievement,
        coherence: row.coherence,
        lexicalResource: row.lexical_resource,
        grammaticalRange: row.grammatical_range,
        comments: row.comments,
        improvedVersion: row.improved_version,
        completedAt: row.completed_at,
      } : null,
    }

    res.json(essay)
  } catch (error) {
    console.error('Get essay error:', error)
    res.status(500).json({ error: 'Failed to fetch essay' })
  }
}

export const deleteEssay = async (req: any, res: Response) => {
  const { id } = req.params
  const userId = req.user.userId

  try {
    // Check if essay belongs to user and is not already paid for
    const essayResult = await pool.query(
      'SELECT user_id, status FROM essays WHERE id = $1',
      [id]
    )

    if (essayResult.rows.length === 0) {
      return res.status(404).json({ error: 'Essay not found' })
    }

    const essay = essayResult.rows[0]

    if (essay.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this essay' })
    }

    if (essay.status !== 'pending_payment') {
      return res.status(400).json({ error: 'Cannot delete essay after payment' })
    }

    // Delete essay and associated payment
    await pool.query('DELETE FROM essays WHERE id = $1', [id])

    res.json({ message: 'Essay deleted successfully' })
  } catch (error) {
    console.error('Delete essay error:', error)
    res.status(500).json({ error: 'Failed to delete essay' })
  }
}

export const getEssayTypes = async (req: any, res: Response) => {
  try {
    const response = await pool.query(
      'SELECT * FROM essay_types'
    )

    if (response.rows.length === 0) {
      return res.status(404).json({ error: 'No Essay Types found' })
    }

    const allEssayTypes = response.rows

    // formatting allEssayTypes to return min_words as minWords to the client
    const allEssayTypesFormatted = response.rows.map(row => ({
      id: row.id,
      name: row.name,
      price: row.price,
      minWords: row.min_words
    }));

    return res.status(200).json(allEssayTypesFormatted)
  } catch (error) {
    console.error('get all Essay Types error: ', error)
    res.status(500).json({ error: 'Failed to get all Essay Types' })
  }
}