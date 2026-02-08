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

export const getFeedbackHistory = async (req: Request, res: Response) => {
  const { essayId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM essay_feedback WHERE essay_id = $1 ORDER BY completed_at DESC',
      [essayId]
    );
    
    const feedbackHistory = result.rows.map(row => ({
      id: row.id,
      essayId: row.essay_id,
      overallBandScore: row.overall_band_score,
      taskAchievement: row.task_achievement,
      coherence: row.coherence,
      lexicalResource: row.lexical_resource,
      grammaticalRange: row.grammatical_range,
      comments: row.comments,
      improvedVersion: row.improved_version,
      completedAt: row.completed_at,
    }));

    res.json(feedbackHistory);
  } catch (error) {
    console.error('Get feedback history error:', error);
    res.status(500).json({ error: 'Failed to fetch feedback history' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalSubmissions = await pool.query('SELECT COUNT(*) FROM essays');
    const pendingSubmissions = await pool.query(
      `SELECT COUNT(*) FROM essays WHERE status = 'pending' OR status = 'in_review'`
    );
    const registeredStudents = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'");
    const totalRevenue = await pool.query("SELECT SUM(amount) FROM payments WHERE status = 'completed'");

    res.json({
      totalSubmissions: totalSubmissions.rows[0].count || 0,
      pendingSubmissions: pendingSubmissions.rows[0].count || 0,
      registeredStudents: registeredStudents.rows[0].count || 0,
      totalRevenue: totalRevenue.rows[0].sum || 0,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};