# 后端
bun + fastify 

# 数据库 pg

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    -- 可以根据你的需求添加其他列，例如 `full_name`, `is_active` 等
);
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- URL 友好的唯一标识符
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published BOOLEAN DEFAULT FALSE, -- 是否已发布
    published_at TIMESTAMP WITH TIME ZONE -- 发布时间
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id), -- 上传用户
    url VARCHAR(255) NOT NULL UNIQUE, -- 图片在对象存储服务中的 URL
    filename VARCHAR(255), -- 原始文件名 (可选)
    mime_type VARCHAR(50), -- 图片 MIME 类型 (可选)
    size INTEGER, -- 图片大小 (可选)
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 鉴权

JWT

## api

**功能:注册用户**
url :
` http://localhost:3000/auth/register`
请求方式 ：POST
```
Content-Type application/json
```
发送json
```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}
```

**功能：登陆**

url:
`http://localhost:3000/auth/login`
请求方式：POST
Header
```
Content-Type application/json
```
发送JSON
```json
{
        "username":"testuser",
        "password": "password123"
}
```


