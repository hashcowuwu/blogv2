import { Type, Static } from '@sinclair/typebox';

const articleSchema = Type.Object({
    id: Type.Integer(),
    authorId: Type.Integer(),
    title: Type.String(),
    slug: Type.String(),
    content: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
    published: Type.Boolean(),
    publishedAt: Type.Union([Type.String(), Type.Null()]),
});

const articleCreateSchema = Type.Object({
    title: Type.String({ minLength: 1, maxLength: 255 }),
    content: Type.String({ minLength: 1 }),
    published: Type.Boolean(),
});

const articleUpdateSchema = Type.Object({
    title: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
    content: Type.Optional(Type.String({ minLength: 1 })),
    published: Type.Optional(Type.Boolean()),
});

export type ArticleType = Static<typeof articleSchema>;
export type ArticleCreateType = Static<typeof articleCreateSchema>;
export type ArticleUpdateType = Static<typeof articleUpdateSchema>;
