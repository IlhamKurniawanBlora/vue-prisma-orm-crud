const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors'); // Import cors
const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors()); // Gunakan middleware cors

// Fungsi untuk seed data bawaan
// async function seedData() {
//   const postCount = await prisma.post.count();
//   if (postCount === 0) {
//     await prisma.post.createMany({
//       data: [
//         {
//           title: 'First Post',
//           content: 'This is the first post',
//           published: true,
//         },
//         {
//           title: 'Second Post',
//           content: 'This is the second post',
//           published: false,
//         },
//         {
//           title: 'Third Post',
//           content: 'This is the third post',
//           published: true,
//         },
//       ],
//     });
//     console.log('Seed data created');
//   } else {
//     console.log('Data already seeded');
//   }
// }

app.get('/posts', async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
});

app.post('/posts', async (req, res) => {
    const { title, content } = req.body;
    try {
      const post = await prisma.post.create({
        data: { title, content },
      });
      console.log('Post created:', post); // Log hasil
      res.json(post);
    } catch (error) {
      console.error('Error creating post:', error); // Log error
      res.status(500).json({ error: 'Failed to create post' });
    }
  });
  
app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, published } = req.body;
  const post = await prisma.post.update({
    where: { id: parseInt(id) },
    data: { title, content, published },
  });
  res.json(post);
});

app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.post.delete({
    where: { id: parseInt(id) },
  });
  res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // await seedData();  // Seed data saat server mulai
});
