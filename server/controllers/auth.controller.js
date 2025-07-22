
const prisma = require("../config/prisma")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const logger = require('../utils/logger');

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        logger.info('Login attempt: %s', email);
        // Step 1: Check Email
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (!user) {
            logger.warn('Login failed: user not found (%s)', email);
            return res.status(400).json({ message: "ไม่พบบัญชีนี้" })
        }
        // Step 2: Check password (ถ้ามี field password ใน schema)
        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                logger.warn('Login failed: password mismatch (%s)', email);
                return res.status(400).json({ message: "อีเมลล์ และ รหัสผ่านไม่ถูกต้อง" })
            }
        }
        // Step 3: create Payload
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }
        // Step 4: Generate Token
        jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) {
                logger.error('JWT sign error: %s', err.stack || err.message);
                return res.status(500).json({ message: "Server Error" })
            }
            logger.info('Login success: %s', email);
            res.json({ payload, token })
        })
    } catch (error) {
        logger.error('Login error: %s', error.stack || error.message);
        return res.status(500).json({ message: "Server Error" })
    }
}

// Get current user
exports.currentUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                role: true,
                licensePlate: true
            }
        })
        if (!user) {
            logger.warn('Current user not found: id=%s', req.user.id);
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user })
    } catch (err) {
        logger.error('Current user error: %s', err.stack || err.message);
        return res.status(500).json({ message: "Server Error" })
    }
}

// Register default admin from ENV or fallback
exports.registerDefaultAdmin = async (req, res) => {
    try {
        const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@admin.com';
        const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin1234';
        const name = 'Admin';
        const phone = '0000000000';
        const role = 'admin';
        const licensePlate = '';
        const { secret } = req.body;
        if (secret !== process.env.DEFAULT_ADMIN_SECRET) {
            logger.warn('Register default admin forbidden: invalid secret');
            return res.status(403).json({ message: "Forbidden: Invalid secret" });
        }
        // Check if admin already exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            logger.warn('Register default admin failed: already exists (%s)', email);
            return res.status(400).json({ message: 'Default admin already exists.' });
        }
        // ถ้ามี field password ใน schema
        let userData = { name, phone, email, role, licensePlate };
        if (prisma.user.fields && prisma.user.fields.password) {
            const hashPassword = await bcrypt.hash(password, 10);
            userData.password = hashPassword;
        }
        const newUser = await prisma.user.create({ data: userData });
        logger.info('Default admin created: %s', email);
        res.json({ message: 'Default admin created successfully.', email, password });
    } catch (error) {
        logger.error('Register default admin error: %s', error.stack || error.message);
        return res.status(500).json({ message: 'registerDefaultAdmin error' });
    }
}