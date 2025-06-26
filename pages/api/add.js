import { getDBConnection } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { rollno, firstName, lastName } = req.body;

    if (!rollno || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const db = await getDBConnection();
      
      // Check if student with this roll already exists
      const [existing] = await db.execute(
        'SELECT * FROM test WHERE roll = ?',
        [rollno]
      );

      if (existing.length > 0) {
        await db.end();
        return res.status(400).json({ error: 'Student with this roll number already exists' });
      }

      await db.execute(
        'INSERT INTO test (roll, firstName, lastName) VALUES (?, ?, ?)',
        [rollno, firstName, lastName]
      );

      await db.end();
      return res.status(200).json({ 
        message: 'Student added successfully',
        student: { roll: rollno, firstname: firstName, lastname: lastName }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to add student' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}