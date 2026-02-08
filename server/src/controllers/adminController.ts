import { Request, Response } from 'express';
import pool from '../config/database';

export const getAllEssays = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.id,
        e.content,
        e.status,
        e.submitted_at,
        u.name as user_name,
        u.email as user_email,
        p.status as payment_status
      FROM essays e
      JOIN users u ON e.user_id = u.id
      LEFT JOIN payments p ON e.id = p.essay_id
      ORDER BY e.submitted_at DESC
    `);

    const essays = result.rows.map(row => ({
      id: row.id,
      content: row.content,
      status: row.status,
      submittedAt: row.submitted_at,
      user: {
        name: row.user_name,
        email: row.user_email,
      },
      paymentStatus: row.payment_status,
    }));

    res.json(essays);
  } catch (error) {
    console.error('Get all essays error:', error);
    res.status(500).json({ error: 'Failed to fetch essays' });
  }
};

export const getEssayById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM essays WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Essay not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get essay by id error:', error);
    res.status(500).json({ error: 'Failed to fetch essay' });
  }
};

export const submitFeedback = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { comments, improvedVersion, overallBandScore, taskAchievement, coherence, lexicalResource, grammaticalRange } = req.body;

  try {
    await pool.query('BEGIN');

    const feedbackResult = await pool.query(
      `INSERT INTO essay_feedback (essay_id, comments, improved_version, overall_band_score, task_achievement, coherence, lexical_resource, grammatical_range)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [id, comments, improvedVersion, overallBandScore || 0, taskAchievement || 0, coherence || 0, lexicalResource || 0, grammaticalRange || 0]
    );

    await pool.query(
      `UPDATE essays SET status = 'completed' WHERE id = $1`,
      [id]
    );

    await pool.query('COMMIT');

    res.status(201).json({ feedbackId: feedbackResult.rows[0].id });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};