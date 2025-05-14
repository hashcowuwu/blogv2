// src/modules/article/article.route.ts
import { FastifyPluginCallback } from "fastify";
import { authenticate } from "../../hooks/auth.hook";
import {
  getArticlesHandler,
  getArticleByIdHandler,
  createArticleHandler,
  updateArticleHandler,
  deleteArticleHandler,
  getCategoriesHandler,
  getArticlesByCategoryHandler,
  getTagsHandler,
  getArticlesByTagHandler,
} from "./article.controller";
import {
  createArticleSchema,
  updateArticleSchema,
  getArticleParamsSchema,
  getArticlesQuerySchema,
  categoryParamsSchema,
  tagParamsSchema,
  articleResponseSchema, // 示例响应 schema
  categoryResponseSchema, // 示例响应 schema
  tagResponseSchema, // 示例响应 schema
  articlesResponseSchema, // 示例响应 schema
} from "./article.schema";
import { Type } from "@sinclair/typebox";

const articleRoutes: FastifyPluginCallback = async (fastify, options) => {
  // 获取文章列表
  fastify.get(
    "/articles",
    {
      schema: {
        querystring: getArticlesQuerySchema,
        response: { 200: articlesResponseSchema },
      },
    },
    getArticlesHandler,
  );

  // 根据 ID 获取单篇文章
  fastify.get(
    "/articles/:id",
    {
      schema: {
        params: getArticleParamsSchema,
        response: { 200: articleResponseSchema },
      },
    },
    getArticleByIdHandler,
  );

  // 创建新文章 (需要鉴权)
  fastify.post(
    "/articles",
    {
      preHandler: [authenticate],
      schema: {
        body: createArticleSchema,
        response: { 201: articleResponseSchema },
      },
    },
    createArticleHandler,
  );

  // 更新指定 ID 的文章 (需要鉴权)
  fastify.put(
    "/articles/:id",
    {
      preHandler: [authenticate],
      schema: {
        params: getArticleParamsSchema,
        body: updateArticleSchema,
        response: { 200: articleResponseSchema },
      },
    },
    updateArticleHandler,
  );

  // 删除指定 ID 的文章 (需要鉴权)
  fastify.delete(
    "/articles/:id",
    { preHandler: [authenticate], schema: { params: getArticleParamsSchema } },
    deleteArticleHandler,
  );

  // 获取文章分类列表
  fastify.get(
    "/articles/categories",
    { schema: { response: { 200: Type.Array(categoryResponseSchema) } } },
    getCategoriesHandler,
  );

  // 根据分类别名获取文章列表
  fastify.get(
    "/articles/categories/:slug",
    {
      schema: {
        params: categoryParamsSchema,
        response: { 200: articlesResponseSchema },
      },
    },
    getArticlesByCategoryHandler,
  );

  // 获取文章标签列表
  fastify.get(
    "/articles/tags",
    { schema: { response: { 200: Type.Array(tagResponseSchema) } } },
    getTagsHandler,
  );

  // 根据标签别名获取文章列表
  fastify.get(
    "/articles/tags/:slug",
    {
      schema: {
        params: tagParamsSchema,
        response: { 200: articlesResponseSchema },
      },
    },
    getArticlesByTagHandler,
  );
};

export default articleRoutes;
