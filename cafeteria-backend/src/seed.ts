import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const INITIAL_MENU = [
  {
    name: "Grilled Salmon Quinoa Bowl",
    category: "Entrees",
    description: "Pacific grilled salmon served over warm organic quinoa, fresh avocado slices, steamed broccoli, and citrus-herb drizzle.",
    price: 16.99,
    calories: 580,
    allergens: "Fish",
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    name: "Garden Veggie Avocado Wrap",
    category: "Entrees",
    description: "Crisp romaine, vine-ripened tomatoes, cucumbers, shredded carrots, and creamy guacamole wrapped in a spinach tortilla.",
    price: 9.95,
    calories: 340,
    allergens: "Wheat",
    image_url: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    name: "Golden Turmeric Lentil Soup",
    category: "Soups",
    description: "Slow-simmered red lentils with warming spices, carrots, celery, fresh spinach, and lemon infusion.",
    price: 6.50,
    calories: 220,
    allergens: "",
    image_url: "https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    name: "Mediterranean Chickpea Salad",
    category: "Salads",
    description: "Garbanzo beans, English cucumbers, cherry tomatoes, kalamata olives, red onions, and dairy-free feta with balsamic glaze.",
    price: 11.25,
    calories: 390,
    allergens: "",
    image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    name: "Classic High-Protein Pancakes",
    category: "Breakfast",
    description: "Fluffy oat-flour pancakes packed with whey protein, served with fresh blueberries and 100% pure maple syrup.",
    price: 10.50,
    calories: 450,
    allergens: "Milk, Eggs",
    image_url: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    name: "Matcha Mint Collagen Cooler",
    category: "Beverages",
    description: "Organic stone-ground green tea, organic mint, almond milk, and grass-fed collagen peptides blended over ice.",
    price: 5.75,
    calories: 140,
    allergens: "Tree Nuts",
    image_url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    name: "Raw Chia Seed Dark Chocolate Mousse",
    category: "Desserts",
    description: "Decadent dessert made with rich avocado, raw organic cacao, chia seeds, dates, and coconut whipped topping.",
    price: 6.95,
    calories: 280,
    allergens: "",
    image_url: "https://images.unsplash.com/photo-1541795795328-f073b763494e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    name: "Baked Sweet Potato Wedges",
    category: "Sides",
    description: "Crispy oven-baked sweet potato wedges dusted with pink Himalayan salt, paprika, and a touch of rosemary.",
    price: 4.50,
    calories: 180,
    allergens: "",
    image_url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

async function main() {
  console.log("Seeding database with mock data...");
  
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash('password123', salt);

  // Create a default user so orders can be placed
  const user = await prisma.user.upsert({
    where: { email: 'sanjai.it.3rd@edu.in' },
    update: { password_hash },
    create: {
      username: 'Sanjai',
      email: 'sanjai.it.3rd@edu.in',
      password_hash: password_hash,
      role: 'Customer'
    }
  });

  console.log("Created user:", user.username, "with password: password123");

  // Empty existing menu and seed
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  
  // Seed Menu
  for (const item of INITIAL_MENU) {
    await prisma.menuItem.create({
      data: {
        ...item,
        status: "Active"
      }
    });
  }

  console.log("Database seeding completed.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
