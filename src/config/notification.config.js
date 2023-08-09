import dotenv from 'dotenv';

dotenv.config({
  path: `.env`,
});

const notificationConfig = {
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
};

export default notificationConfig;
