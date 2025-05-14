// src/modules/article/article.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { ArticleService } from "./article.service";
import {
  CreateArticleDto,
  UpdateArticleDto,
  GetArticlesQueryDto,
  GetArticleParamsDto,
  CategoryParamsDto,
  TagParamsDto,
} from "./article.schema";

const articleService = new ArticleService();

export const getArticlesHandler = async (
  request: FastifyRequest<{ Querystring: GetArticlesQueryDto }>,
  reply: FastifyReply,
) => {
  try {
    const articles = await articleService.getAllArticles(request.query);
    reply.send(articles);
  } catch (error: any) {
    console.error("Error fetching articles:", error);
    reply
      .status(500)
      .send({ message: error.message || "Failed to fetch articles" });
  }
};

export const getArticleByIdHandler = async (
  request: FastifyRequest<{ Params: GetArticleParamsDto }>,
  reply: FastifyReply,
) => {
  try {
    const article = await articleService.getArticleById(
      parseInt(request.params.id),
    );
    if (article) {
      reply.send(article);
    } else {
      reply.status(404).send({ message: "Article not found" });
    }
  } catch (error: any) {
    console.error("Error fetching article:", error);
    reply
      .status(500)
      .send({ message: error.message || "Failed to fetch article" });
  }
};

export const createArticleHandler = async (
  request: FastifyRequest<{ Body: CreateArticleDto }>,
  reply: FastifyReply,
) => {
  try {
    const newArticle = await articleService.createArticle(request.body);
    reply.status(201).send(newArticle);
  } catch (error: any) {
    console.error("Error creating article:", error);
    reply
      .status(500)
      .send({ message: error.message || "Failed to create article" });
  }
};

export const updateArticleHandler = async (
  request: FastifyRequest<{
    Params: GetArticleParamsDto;
    Body: UpdateArticleDto;
  }>,
  reply: FastifyReply,
) => {
  try {
    const updatedArticle = await articleService.updateArticle(
      parseInt(request.params.id),
      request.body,
    );
    if (updatedArticle) {
      reply.send(updatedArticle);
    } else {
      reply.status(404).send({ message: "Article not found" });
    }
  } catch (error: any) {
    console.error("Error updating article:", error);
    reply
      .status(500)
      .send({ message: error.message || "Failed to update article" });
  }
};

export const deleteArticleHandler = async (
  request: FastifyRequest<{ Params: GetArticleParamsDto }>,
  reply: FastifyReply,
) => {
  try {
    const success = await articleService.deleteArticle(
      parseInt(request.params.id),
    );
    if (success) {
      reply.status(204).send();
    } else {
      reply.status(404).send({ message: "Article not found" });
    }
  } catch (error: any) {
    console.error("Error deleting article:", error);
    reply
      .status(500)
      .send({ message: error.message || "Failed to delete article" });
  }
};

export const getCategoriesHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const categories = await articleService.getAllCategories();
    reply.send(categories);
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    reply
      .status(500)
      .send({ message: error.message || "Failed to fetch categories" });
  }
};

export const getArticlesByCategoryHandler = async (
  request: FastifyRequest<{
    Params: CategoryParamsDto;
    Querystring: GetArticlesQueryDto;
  }>,
  reply: FastifyReply,
) => {
  try {
    const articles = await articleService.getArticlesByCategorySlug(
      request.params.slug,
      request.query,
    );
    reply.send(articles);
  } catch (error: any) {
    console.error("Error fetching articles by category:", error);
    reply
      .status(500)
      .send({
        message: error.message || "Failed to fetch articles by category",
      });
  }
};

export const getTagsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const tags = await articleService.getAllTags();
    reply.send(tags);
  } catch (error: any) {
    console.error("Error fetching tags:", error);
    reply
      .status(500)
      .send({ message: error.message || "Failed to fetch tags" });
  }
};

export const getArticlesByTagHandler = async (
  request: FastifyRequest<{
    Params: TagParamsDto;
    Querystring: GetArticlesQueryDto;
  }>,
  reply: FastifyReply,
) => {
  try {
    const articles = await articleService.getArticlesByTagSlug(
      request.params.slug,
      request.query,
    );
    reply.send(articles);
  } catch (error: any) {
    console.error("Error fetching articles by tag:", error);
    reply
      .status(500)
      .send({ message: error.message || "Failed to fetch articles by tag" });
  }
};
