import { getDBConnection } from '@/lib/db';

export default async function handler(req, res) {
  // const { rollno } = req.query;

  if (req.method === 'PUT') {
    const { rollno,firstName, lastName } = req.body;

    if (!rollno || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const db = await getDBConnection();
      const [result] = await db.execute(
        'UPDATE test SET firstName = ?, lastName = ? WHERE roll = ?',
        [firstName, lastName, rollno]
      );

      await db.end();

      if (result.affectedRows > 0) {
        return res.status(200).json({ 
          message: 'Student updated successfully',
          student: { 
            roll: rollno, 
            firstname: firstName, 
            lastname: lastName 
          }
        });
      } else {
        return res.status(404).json({ error: 'Student not found' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update student' });
    }
  } else if (req.method === 'DELETE') {
    // You can add DELETE handler here too if you want
    return res.status(405).json({ error: 'Method not allowed' });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}