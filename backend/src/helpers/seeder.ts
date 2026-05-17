import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../models/user.model'
import { Lead } from '../models/lead.model'

dotenv.config()

const NAMES = [
  'Arjun Kumar', 'Sneha Reddy', 'Vikram Singh', 'Meera Pillai', 'Karthik Menon',
  'Divya Thomas', 'Rohan Verma', 'Ananya Das', 'Siddharth Rao', 'Lakshmi Iyer',
  'Rahul Gupta', 'Pooja Mehta', 'Amit Shah', 'Priya Nair', 'Suresh Babu',
  'Kavitha Rajan', 'Deepak Joshi', 'Nithya Krishnan', 'Manoj Tiwari', 'Sunita Patel',
  'Vijay Sharma', 'Rekha Menon', 'Arun Kumar', 'Swathi Reddy', 'Ganesh Iyer',
  'Pallavi Singh', 'Nikhil Das', 'Shreya Gupta', 'Rajesh Nair', 'Lavanya Babu',
  'Harish Rajan', 'Sowmya Joshi', 'Praveen Krishnan', 'Usha Tiwari', 'Bala Patel',
  'Geetha Sharma', 'Senthil Menon', 'Yamuna Kumar', 'Dinesh Reddy', 'Valli Iyer',
  'Aditya Singh', 'Bhavana Das', 'Ravi Gupta', 'Saranya Nair', 'Mohan Babu',
  'Chitra Rajan', 'Saravanan Joshi', 'Keerthi Krishnan', 'Venkat Tiwari', 'Malathi Patel',
]

const SALES_TEAM = [
  { name: 'Rahul Sharma',   email: 'rahul@leads.com' },
  { name: 'Priya Nair',     email: 'priya@leads.com' },
  { name: 'Karthik Menon',  email: 'karthik@leads.com' },
  { name: 'Divya Thomas',   email: 'divya@leads.com' },
  { name: 'Vikram Singh',   email: 'vikram@leads.com' },
  { name: 'Sneha Reddy',    email: 'sneha@leads.com' },
  { name: 'Rohan Verma',    email: 'rohan@leads.com' },
  { name: 'Ananya Das',     email: 'ananya@leads.com' },
  { name: 'Suresh Babu',    email: 'suresh@leads.com' },
  { name: 'Kavitha Rajan',  email: 'kavitha@leads.com' },
]

const STATUSES = ['new', 'contacted', 'qualified', 'lost'] as const
const SOURCES  = ['website', 'instagram', 'referral'] as const

const rand = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]

const randomEmail = (name: string, i: number) =>
  `${name.split(' ')[0].toLowerCase()}${i}@gmail.com`

const randomDate = (daysBack: number) => {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack))
  return d
}

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI as string)
  console.log('Connected...')

  await User.deleteMany({})
  await Lead.deleteMany({})

  const hashed = await bcrypt.hash('password123', 12)

  // Admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@leads.com',
    password: hashed,
    role: 'admin',
  })

  // 10 Sales users
  const salesUsers = await User.insertMany(
    SALES_TEAM.map(u => ({
      name: u.name,
      email: u.email,
      password: hashed,
      role: 'sales',
    }))
  )

  // 50 Leads
  const leads = NAMES.map((name, i) => ({
    name,
    email: randomEmail(name, i),
    phone: `98765${String(43210 + i).padStart(5, '0')}`,
    status: rand(STATUSES),
    source: rand(SOURCES),
    notes: i % 3 === 0 ? 'Follow up scheduled' : i % 3 === 1 ? 'High priority client' : undefined,
    assignedTo: salesUsers[i % salesUsers.length]._id,
    createdBy: i % 5 === 0 ? admin._id : salesUsers[i % salesUsers.length]._id,
    createdAt: randomDate(90),
  }))

  await Lead.insertMany(leads)

  console.log('✅ Seeded successfully!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Admin:   admin@leads.com / password123')
  SALES_TEAM.forEach(u => console.log(`Sales:   ${u.email} / password123`))
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Total leads: 50 | Sales users: 10')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})