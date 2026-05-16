import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { Lead } from '../models/lead.model';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('Connected for seeding...');

  // Clear existing
  await User.deleteMany({});
  await Lead.deleteMany({});

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@leads.com',
    password: hashedPassword,
    role: 'admin',
  });

  const sales1 = await User.create({
    name: 'Rahul Sharma',
    email: 'rahul@leads.com',
    password: hashedPassword,
    role: 'sales',
  });

  const sales2 = await User.create({
    name: 'Priya Nair',
    email: 'priya@leads.com',
    password: hashedPassword,
    role: 'sales',
  });

  // Sample leads
  const leads = [
    { name: 'Arjun Kumar',     email: 'arjun@gmail.com',  assignedTo: sales1._id, phone: '9876543210', status: 'new',       source: 'website',   createdBy: sales1._id },
    { name: 'Sneha Reddy',     email: 'sneha@gmail.com',  assignedTo: sales1._id, phone: '9876543211', status: 'contacted', source: 'instagram', createdBy: sales1._id },
    { name: 'Vikram Singh',    email: 'vikram@gmail.com', assignedTo: sales1._id, phone: '9876543212', status: 'qualified', source: 'referral',  createdBy: sales2._id },
    { name: 'Meera Pillai',    email: 'meera@gmail.com',  assignedTo: sales1._id, phone: '9876543213', status: 'lost',      source: 'website',   createdBy: sales2._id },
    { name: 'Karthik Menon',   email: 'karthik@gmail.com',assignedTo: sales1._id, phone: '9876543214', status: 'new',       source: 'instagram', createdBy: admin._id },
    { name: 'Divya Thomas',    email: 'divya@gmail.com',  assignedTo: sales2._id, phone: '9876543215', status: 'contacted', source: 'referral',  createdBy: sales1._id },
    { name: 'Rohan Verma',     email: 'rohan@gmail.com',  assignedTo: sales2._id, phone: '9876543216', status: 'qualified', source: 'website',   createdBy: sales1._id },
    { name: 'Ananya Das',      email: 'ananya@gmail.com', assignedTo: sales2._id, phone: '9876543217', status: 'new',       source: 'instagram', createdBy: sales2._id },
    { name: 'Siddharth Rao',   email: 'sid@gmail.com',    assignedTo: sales2._id, phone: '9876543218', status: 'lost',      source: 'referral',  createdBy: admin._id },
    { name: 'Lakshmi Iyer',    email: 'lakshmi@gmail.com',assignedTo: sales2._id, phone: '9876543219', status: 'new',       source: 'website',   createdBy: sales2._id },
    { name: 'Rahul Gupta',     email: 'rgupta@gmail.com', assignedTo: sales2._id, phone: '9876543220', status: 'contacted', source: 'instagram', createdBy: sales1._id },
    { name: 'Pooja Mehta',     email: 'pooja@gmail.com',  assignedTo: sales1._id, phone: '9876543221', status: 'qualified', source: 'website',   createdBy: sales2._id },
  ];

  await Lead.insertMany(leads);

  console.log('✅ Seeded: 3 users, 12 leads');
  console.log('Admin:   admin@leads.com / password123');
  console.log('Sales 1: rahul@leads.com / password123');
  console.log('Sales 2: priya@leads.com / password123');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});