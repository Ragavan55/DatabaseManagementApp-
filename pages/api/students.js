import { getDBConnection } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const db = await getDBConnection();
    const [rows] = await db.execute('SELECT * FROM test'); // Replace test with your table name
    res.status(200).json(rows);
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ error: 'Database query failed' });
  }
}
