import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'gateway01.us-west-2.prod.aws.tidbcloud.com',       // e.g., gateway01.ap-southeast-1.prod.aws.tidbcloud.com
  user: '27FkNQ7xoRuTXs3.root',       // e.g., root
  password: 'fkKKZkPzAqLpSBl1',
  database: 'test',
  port: 4000,                   
  ssl: {
    rejectUnauthorized : true
  }
};

export async function getDBConnection() {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
}
