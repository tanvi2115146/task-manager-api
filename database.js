import dotenv from 'dotenv'
import pkg from 'pg';

dotenv.config();

const { Client } = pkg;

const con = new Client({
    password:process.env.PASSWORD,
    host:process.env.HOST,
    user:process.env.USER,
    port:process.env.PORT,
    database:process.env.DATABASE,
       
});

con.connect().then((console.log("connected")));

const jwtSecret = process.env.JWTSECRET;
export {con, jwtSecret};