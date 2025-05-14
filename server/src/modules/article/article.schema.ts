// src/modules/article/article.schema.ts
import { Type, Static } from "@sinclair/typebox";

// 创建文章的请求体 Schema
export const createArticleSchema = Type.Object({
  author_id: Type.Number(),
  title: Type.String(),
  content: Type.String(),
  published: Type.Optional(Type.Boolean({ default: false })),
});
export type CreateArticleDto = Static<typeof createArticleSchema>;

// 更新文章的请求体 Schema
export const updateArticleSchema = Type.Partial(
  Type.Omit(createArticleSchema, ["author_id"]),
);
export type UpdateArticleDto = Static<typeof updateArticleSchema>;

// 获取单篇文章的路径参数 Schema
export const getArticleParamsSchema = Type.Object({
  id: Type.String(),
});
export type GetArticleParamsDto = Static<typeof getArticleParamsSchema>;

// 获取文章列表的查询参数 Schema
export const getArticlesQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ default: 1 })),
  pageSize: Type.Optional(Type.Number({ default: 10 })),
  sortBy: Type.Optional(Type.String({ default: "created_at" })),
  sortOrder: Type.Optional(
    Type.Union([Type.Literal("ASC"), Type.Literal("DESC")], {
      default: "DESC",
    }),
  ),
  published: Type.Optional(Type.Boolean()),
  // 可以添加其他筛选或排序参数
});
export type GetArticlesQueryDto = Static<typeof getArticlesQuerySchema>;

// 根据分类获取文章的路径参数 Schema
export const categoryParamsSchema = Type.Object({
  slug: Type.String(),
});
export type CategoryParamsDto = Static<typeof categoryParamsSchema>;

// 根据标签获取文章的路径参数 Schema
export const tagParamsSchema = Type.Object({
  slug: Type.String(),
});
export type TagParamsDto = Static<typeof tagParamsSchema>;

// 文章响应体 Schema
export const articleResponseSchema = Type.Object({
  id: Type.Number(),
  author_id: Type.Number(),
  title: Type.String(),
  slug: Type.String(),
  content: Type.String(),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
  published: Type.Boolean(),
  published_at: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  // 可以包含关联的分类和标签信息
});
export type ArticleResponse = Static<typeof articleResponseSchema>;

// 文章列表响应体 Schema
export const articlesResponseSchema = Type.Array(articleResponseSchema);
export type ArticlesResponse = Static<typeof articlesResponseSchema>;

// 分类响应体 Schema
export const categoryResponseSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  slug: Type.String(),
});
export type CategoryResponse = Static<typeof categoryResponseSchema>;

// 标签响应体 Schema
export const tagResponseSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  slug: Type.String(),
});
export type TagResponse = Static<typeof tagResponseSchema>;
