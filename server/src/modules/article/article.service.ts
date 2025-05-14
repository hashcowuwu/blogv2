// src/modules/article/article.service.ts
import { Pool } from "pg";
import databaseConfig from "../../config/database"; // 导入数据库配置
import slugify from "slugify";
import {
  CreateArticleDto,
  UpdateArticleDto,
  GetArticlesQueryDto,
} from "./article.schema";
import slugify from "slugify";

// 使用数据库配置创建连接池
const pool = new Pool({
  host: databaseConfig.host,
  port: databaseConfig.port,
  user: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.database,
  max: databaseConfig.max,
  idleTimeoutMillis: databaseConfig.idleTimeoutMillis,
  // 如果你使用了 connectionString，可以这样配置：
  // connectionString: databaseConfig.connectionString,
});

interface Article {
  id: number;
  author_id: number;
  title: string;
  slug: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  published: boolean;
  published_at: Date | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

export class ArticleService {
  async getAllArticles(query: GetArticlesQueryDto): Promise<Article[]> {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "created_at",
      sortOrder = "DESC",
      published,
    } = query;
    const offset = (page - 1) * pageSize;
    let whereClause = "";
    const values: any[] = [pageSize, offset, sortBy];
    let paramCount = 4;

    if (published !== undefined) {
      whereClause = `WHERE published = $${paramCount++}`;
      values.push(published);
    }

    try {
      const result = await pool.query<Article>(
        `SELECT id, author_id, title, slug, content, created_at, updated_at, published, published_at FROM articles
         ${whereClause}
         ORDER BY $3 ${sortOrder}
         LIMIT $1 OFFSET $2`,
        values,
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching all articles:", error);
      throw new Error("Failed to fetch articles from the database");
    }
  }

  async getArticleById(id: number): Promise<Article | null> {
    try {
      const result = await pool.query<Article>(
        "SELECT id, author_id, title, slug, content, created_at, updated_at, published, published_at FROM articles WHERE id = $1",
        [id],
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error fetching article by ID:", error);
      throw new Error("Failed to fetch article from the database");
    }
  }

  // async createArticle(articleData: CreateArticleDto): Promise<Article> {
  //   const { author_id, title, content, published = false } = articleData;
  //   const slug = ensureUniqueSlug(slugify(title, { lower: true }));
  //   try {
  //     const result = await pool.query<Article>(
  //       "INSERT INTO articles (author_id, title, slug, content, published) VALUES ($1, $2, $3, $4, $5) RETURNING id, author_id, title, slug, content, created_at, updated_at, published, published_at",
  //       [author_id, title, slug, content, published],
  //     );
  //     return result.rows[0];
  //   } catch (error) {
  //     console.error("Error creating article:", error);
  //     throw new Error("Failed to create article in the database");
  //   }
  // }

  async createArticle(articleData: CreateArticleDto): Promise<Article> {
    const { author_id, title, content, published = false } = articleData;
    const initialSlug = slugify(title, { lower: true });
    const slug = await this.ensureUniqueSlug(initialSlug);
    try {
      const result = await pool.query<Article>(
        "INSERT INTO articles (author_id, title, slug, content, published) VALUES ($1, $2, $3, $4, $5) RETURNING id, author_id, title, slug, content, created_at, updated_at, published, published_at",
        [author_id, title, slug, content, published],
      );
      return result.rows[0];
    } catch (error: any) {
      console.error("Error creating article:", error);
      if (error.code === "23505" && error.constraint === "articles_slug_key") {
        throw new Error("文章标题已存在，无法创建重复的文章。");
      }
      throw new Error("Failed to create article in the database");
    }
  }

  private async ensureUniqueSlug(
    slug: string,
    excludeId?: number,
  ): Promise<string> {
    let newSlug = slug;
    let counter = 1;
    while (true) {
      const query =
        "SELECT id FROM articles WHERE slug = $1" +
        (excludeId ? " AND id != $2" : "");
      const values = excludeId ? [newSlug, excludeId] : [newSlug];
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        break;
      }
      newSlug = `${slug}-${counter}`;
      counter++;
    }
    return newSlug;
  }

  async updateArticle(
    id: number,
    articleData: UpdateArticleDto,
  ): Promise<Article | null> {
    const { title, content, published } = articleData;
    const values = [];
    let query = "UPDATE articles SET updated_at = CURRENT_TIMESTAMP";
    let paramCount = 1;
    let slug: string | undefined;

    if (title) {
      slug = slugify(title, { lower: true });
      query += ` , title = $${paramCount++}, slug = $${paramCount++}`;
      values.push(title, slug);
    }
    if (content) {
      query += ` , content = $${paramCount++}`;
      values.push(content);
    }
    if (published !== undefined) {
      query += ` , published = $${paramCount++}`;
      values.push(published);
    }

    query += ` WHERE id = $${paramCount} RETURNING id, author_id, title, slug, content, created_at, updated_at, published, published_at`;
    values.push(id);

    try {
      const result = await pool.query<Article>(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error updating article:", error);
      throw new Error("Failed to update article in the database");
    }
  }

  async deleteArticle(id: number): Promise<boolean> {
    try {
      const result = await pool.query("DELETE FROM articles WHERE id = $1", [
        id,
      ]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error deleting article:", error);
      throw new Error("Failed to delete article from the database");
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      const result = await pool.query<Category>(
        "SELECT id, name, slug FROM categories",
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching all categories:", error);
      throw new Error("Failed to fetch categories from the database");
    }
  }

  async getArticlesByCategorySlug(
    slug: string,
    query: GetArticlesQueryDto,
  ): Promise<Article[]> {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = query;
    const offset = (page - 1) * pageSize;
    try {
      const result = await pool.query<Article>(
        `SELECT a.id, a.author_id, a.title, a.slug, a.content, a.created_at, a.updated_at, a.published, a.published_at
         FROM articles a
         JOIN categories c ON a.category_id = c.id
         WHERE c.slug = $1
         ORDER BY a.${sortBy} ${sortOrder}
         LIMIT $2 OFFSET $3`,
        [slug, pageSize, offset],
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching articles by category slug:", error);
      throw new Error(
        "Failed to fetch articles by category slug from the database",
      );
    }
  }

  async getAllTags(): Promise<Tag[]> {
    try {
      const result = await pool.query<Tag>("SELECT id, name, slug FROM tags");
      return result.rows;
    } catch (error) {
      console.error("Error fetching all tags:", error);
      throw new Error("Failed to fetch tags from the database");
    }
  }

  async getArticlesByTagSlug(
    slug: string,
    query: GetArticlesQueryDto,
  ): Promise<Article[]> {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = query;
    const offset = (page - 1) * pageSize;
    try {
      const result = await pool.query<Article>(
        `SELECT a.id, a.author_id, a.title, a.slug, a.content, a.created_at, a.updated_at, a.published, a.published_at
         FROM articles a
         JOIN article_tags at ON a.id = at.article_id
         JOIN tags t ON at.tag_id = t.id
         WHERE t.slug = $1
         ORDER BY a.${sortBy} ${sortOrder}
         LIMIT $2 OFFSET $3`,
        [slug, pageSize, offset],
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching articles by tag slug:", error);
      throw new Error("Failed to fetch articles by tag slug from the database");
    }
  }
  private generateSlug(title: string): string {
    return slugify(title, { lower: true });
  }
}
