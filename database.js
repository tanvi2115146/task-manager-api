import dotenv from 'dotenv'
import pkg from 'pg';
import nodemailer from "nodemailer";


dotenv.config();

const { Client } = pkg;

const con = new Client({
    password:process.env.PASSWORD,
    host:process.env.HOST,
    user:process.env.USER,
    port:process.env.PORT,
    database:process.env.DATABASE,
       
});

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    },
  });

con.connect().then((console.log("connected")));

const jwtSecret = process.env.JWTSECRET;
export {con, jwtSecret,transporter};