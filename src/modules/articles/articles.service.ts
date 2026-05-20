import { articleRepository } from './articles.repository';

export class ArticleService {
  async createArticle(authorId: string, data: any) {
    return await articleRepository.create({
      ...data,
      authorId
    });
  }

  async getAuthorArticles(authorId: string, page: number = 1, limit: number = 10) {
    return await articleRepository.findAuthorArticles(authorId, page, limit);
  }

  async updateArticle(articleId: string, authorId: string, data: any) {
    const article = await articleRepository.findById(articleId);
    if (!article) throw new Error('Article not found.');
    if (article.authorId !== authorId) throw new Error('Forbidden.');

    return await articleRepository.update(articleId, data);
  }

  async softDeleteArticle(articleId: string, authorId: string) {
    const article = await articleRepository.findById(articleId);
    if (!article) throw new Error('Article not found.');
    if (article.authorId !== authorId) throw new Error('Forbidden.');

    await articleRepository.softDelete(articleId);
  }

  async getPublishedArticles(filters: any, page: number = 1, limit: number = 10) {
    return await articleRepository.findPublishedArticles(filters, page, limit);
  }

  async getArticleById(id: string) {
    const article = await articleRepository.findById(id);
    if (!article) throw new Error('News article no longer available');
    return article;
  }
}

export const articleService = new ArticleService();
