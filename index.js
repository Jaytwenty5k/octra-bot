import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;

console.log('DB URL:', dbUrl);
console.log('JWT Secret:', jwtSecret);