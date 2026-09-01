import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

app.use(cors());
app.use(express.json());

// --- Middleware ---
interface AuthRequest extends Request {
  user?: any;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied, token missing' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- Auth & Users ---

// Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Create a user (Registration)
app.post('/api/users', async (req: Request, res: Response) => {
  try {
    const { username, email, password, phone_number, role, dietary_restrictions } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
    if (existingUser) return res.status(400).json({ error: 'Username or email already exists' });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash,
        phone_number,
        role: role || 'Customer',
        dietary_restrictions
      }
    });
    res.status(201).json({ id: user.id, username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get all users (Staff only normally)
app.get('/api/users', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true, is_active: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// --- Menu Items ---

app.get('/api/menu', async (req: Request, res: Response) => {
  try {
    const menu = await prisma.menuItem.findMany({
      where: { status: 'Active' }
    });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

app.post('/api/menu', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, description, price, calories, allergens, image_url } = req.body;
    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        category,
        description,
        price,
        calories,
        allergens,
        chef_id: req.user.id,
        image_url
      }
    });
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// --- Orders ---

app.get('/api/orders', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    let whereClause = {};
    if (req.user.role === 'Customer') {
      whereClause = { customer_id: req.user.id };
    }
    
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        customer: { select: { username: true, email: true } },
        order_items: {
          include: { menu_item: true }
        }
      },
      orderBy: { order_date: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { order_items, payment_method, special_instructions } = req.body;
    
    // order_items should be an array of { menu_item_id, quantity, unit_price, special_requests }
    const total_amount = order_items.reduce((sum: number, item: any) => sum + (item.unit_price * item.quantity), 0);

    const order = await prisma.order.create({
      data: {
        customer_id: req.user.id,
        total_amount,
        payment_method,
        special_instructions,
        order_items: {
          create: order_items.map((item: any) => ({
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            special_requests: item.special_requests
          }))
        }
      },
      include: {
        order_items: true
      }
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.patch('/api/orders/:id/status', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Preparing, Ready, Completed, Cancelled
    
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status }
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// --- Inventory ---

app.get('/api/inventory', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const inventory = await prisma.inventory.findMany();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

app.post('/api/inventory', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { item_name, quantity, unit, reorder_level, expiration_date } = req.body;
    const inventory = await prisma.inventory.create({
      data: {
        item_name,
        quantity,
        unit,
        reorder_level,
        expiration_date: expiration_date ? new Date(expiration_date) : null
      }
    });
    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

app.listen(PORT, () => {
  console.log(`Cafeteria Backend Server running on port ${PORT}`);
});
