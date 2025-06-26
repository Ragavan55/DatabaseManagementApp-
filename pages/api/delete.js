import { getDBConnection } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    try {
      const db = await getDBConnection();
      const [result] = await db.execute('DELETE FROM test WHERE roll = ?', [id]);
      await db.end();

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Student deleted successfully' });
      } else {
        return res.status(404).json({ error: 'Student not found' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete student' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}