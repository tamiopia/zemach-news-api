import { z } from 'zod';

export const CreateArticleSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(150, 'Title cannot exceed 150 characters.'),
  content: z.string().min(50, 'Content must be at least 50 characters long.'),
  category: z.string().min(1, 'Category is required.'),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional()
});

export const UpdateArticleSchema = CreateArticleSchema.partial();
