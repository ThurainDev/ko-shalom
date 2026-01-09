const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const Visit = require('../models/Visit');

const AdminController = {
  // Create a new admin user
  create: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
      const existing = await Admin.findOne({ username });
      if (existing) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new Admin({ username, password: hashedPassword });
      await admin.save();
      res.status(201).json({ message: 'Admin user created', admin: { username: admin.username, _id: admin._id } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  // Get total visits and visits per day
  getVisits: async (req, res) => {
    try {
      const total = await Visit.countDocuments();
      // Visits per day (last 7 days)
      const last7 = await Visit.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 7 }
      ]);
      res.json({ total, last7 });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = AdminController; 