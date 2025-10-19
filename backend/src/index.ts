import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { generateToken, authMiddleware, requireRole } from './auth';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

app.get('/health', (req, res) => res.json({ ok: true }));

// Auth
app.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = generateToken({ userId: user.id, role: user.role });
  res.json({ token });
});

// register: open registration creates USER role. To create ADMIN use DB or seed.
app.post('/auth/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ error: 'User exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed, role: 'USER' } });
  const token = generateToken({ userId: user.id, role: user.role });
  res.json({ token });
});

// me: get current user info
app.get('/auth/me', authMiddleware, async (req: Request & { user?: any }, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password, ...rest } = user as any;
  res.json(rest);
});

// Devices CRUD
app.post('/devices', authMiddleware, requireRole('ADMIN'), async (req: Request & { user?: any }, res: Response) => {
  const data = req.body;
  const device = await prisma.device.create({ data });
  await prisma.log.create({ data: { userId: req.user.userId, action: 'create_device', meta: JSON.stringify(device) } });
  res.json(device);
});

app.get('/devices', authMiddleware, async (req: Request & { user?: any }, res: Response) => {
  const devices = await prisma.device.findMany();
  res.json(devices);
});

// Documents CRUD
app.post('/documents', authMiddleware, async (req: Request & { user?: any }, res: Response) => {
  const { caseNumber, type, pages, processNumber } = req.body;
  // build title
  const lowerType = type.toLowerCase();
  const title = `${caseNumber} ${type} ${pages}стр`;
  const doc = await prisma.document.create({ data: { caseNumber, type, pages: Number(pages), title, processNumber } });
  await prisma.log.create({ data: { userId: req.user.userId, action: 'create_document', meta: JSON.stringify(doc) } });
  res.json(doc);
});

// Upload scanned document file
app.post('/documents/:id/upload', authMiddleware, upload.single('file'), async (req: Request & { user?: any }, res: Response) => {
  const id = Number(req.params.id);
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const path = req.file.path;
  const doc = await prisma.document.update({ where: { id }, data: { /* future: filePath: path */ } });
  await prisma.log.create({ data: { userId: req.user.userId, action: 'upload_document', meta: JSON.stringify({ id, path }) } });
  res.json({ ok: true, path });
});

app.get('/documents', authMiddleware, async (req: Request & { user?: any }, res: Response) => {
  const docs = await prisma.document.findMany();
  res.json(docs);
});

app.put('/documents/:id/status', authMiddleware, async (req: Request & { user?: any }, res: Response) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  const doc = await prisma.document.update({ where: { id }, data: { status } });
  await prisma.log.create({ data: { userId: req.user.userId, action: 'update_document_status', meta: JSON.stringify({ id, status }) } });
  res.json(doc);
});

// Change password
app.post('/auth/change-password', authMiddleware, async (req: Request & { user?: any }, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) return res.status(400).json({ error: 'Old password incorrect' });
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
  res.json({ ok: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
