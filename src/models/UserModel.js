import mongoose from 'mongoose';

const UsersSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  secret: String,
  loginDate: {
    type: Date,
    default: Date.now,
  },
});

const Users = mongoose.model('Users', UsersSchema, 'Users');


export { Users };
