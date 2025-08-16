---
title: SQL 语言规范与基础操作指南
date: 2025-08-16 10:13:26
tags: [MySQL]
categories: [数据库]
---
# SQL 语言规范与基础操作指南

SQL 作为数据库操作的核心语言，遵循规范的语法和书写习惯不仅能提高代码可读性，还能减少错误。本文整理了 SQL 的基础规则、书写规范及常用操作，适合初学者快速上手。

## 一、SQL 基本规则

### 1. 书写格式

- SQL 语句可写在一行或多行，**推荐各子句分行书写并适当缩进**，例如：

```sql
SELECT id, name 
FROM student 
WHERE age > 18;
```

- 每条命令必须使用下列其中一个用在末尾用结束语句（**; 最常用**）
  -  **;** 
  -  \g
  -  \G 

### 2. 关键字与标点

- 关键字（如SELECT、FROM、WHERE）**不可缩写或分行**，需完整书写。

- 标点符号必须使用**英文半角**（如'、"、()），且需成对出现（如引号、括号不能遗漏闭合）。

- 字符串和日期时间类型的值需用**单引号（' '）** 包裹，例如 '2023-01-01'。

- 列的别名建议用**双引号（" "）**，且AS关键字可省略（但不建议），例如：

```sql
SELECT id AS "编号", name "姓名" FROM student; -- 正确
```

## 二、大小写规范

MySQL 的大小写敏感性与操作系统相关，遵循以下规则可避免混淆：

- **Windows 环境**：大小写不敏感（例如select和SELECT等效）。

- **Linux 环境**：大小写敏感（数据库名、表名、表别名严格区分大小写）。

**推荐书写规范**：

- 数据库名、表名、字段名、别名等**全部小写**（如student_info、user_id）。

- SQL 关键字、函数名**全部大写**（如SELECT、INSERT、COUNT()）。

示例：

```sql
-- 推荐写法
SELECT id, name FROM student WHERE age > 20;

-- 不推荐（大小写混乱）
Select ID, Name from Student where Age>20;
```

## 三、SQL 注释用法

注释是代码的 “说明书”，SQL 支持三种注释方式：

1. **单行注释（#）**：MySQL 特有的方式，#后直接写注释内容

```sql
# 查询所有学生信息
SELECT * FROM student;
```

1. **单行注释（-- ）**：通用方式，--后必须加空格

```sql
-- 查询年龄大于18的学生
SELECT * FROM student WHERE age > 18;
```

1. **多行注释（/* */）**：适合大段说明

```sql
/*
功能：查询学生表中
年龄大于20且性别为男的记录
*/
SELECT * FROM student WHERE age > 20 AND gender = '男';
```

## 四、命名规则

合理的命名是规范的核心，需注意以下几点：

1. **长度限制**：数据库名、表名最多 30 个字符，变量名最多 29 个字符。

1. **允许字符**：只能包含 A-Z、a-z、0-9、_（下划线），**不可包含空格**。

1. **唯一性**：

- - 同一 MySQL 实例中，数据库名不可重复；

- - 同一数据库中，表名不可重复；

- - 同一表中，字段名不可重复。

1. **避免保留字**：若字段名与关键字（如order、select）重名，需用 ** 着重号（`）** 包裹：

```sql
-- 正确：用`包裹关键字作为表名
CREATE TABLE `order` (
  id INT,
  order_no VARCHAR(20)
);
```

1. **类型一致性**：同一字段在不同表中类型需一致（如user_id在 A 表是INT，在 B 表也应是INT）。

## 五、数据导入指令

当需要批量导入数据时，可通过source命令导入 SQL 文件，步骤如下：

1. 打开命令行客户端，登录 MySQL：

```bash
mysql -u 用户名 -p
```

1. 输入密码后，使用source指令导入（文件路径需用绝对路径）：

```bash
source D:\data\mydb.sql; -- Windows系统
-- 或
source /home/user/data/mydb.sql; -- Linux系统
```

## 六、基础 SELECT 语句

SELECT是 SQL 中最常用的查询语句，基础语法如下：

### 1. 选择全部列

```sql
SELECT * FROM 表名; -- 查询表中所有字段的所有记录
-- 示例：查询student表所有数据
SELECT * FROM student;
```

### 2. 选择指定列

```sql
SELECT 列1, 列2, ... FROM 表名;
-- 示例：查询student表的id和name字段
SELECT id, name FROM student;
```

### 3. 列的别名规则

- 别名无空格时，可省略双引号：

```sql
SELECT id AS 编号, name 姓名 FROM student; -- 正确
```

- 别名有空格时，**必须加双引号**：

```sql
SELECT id AS "学生编号", name "学生姓名" FROM student; -- 正确
SELECT id AS 学生 编号; -- 错误（空格未加引号）
```

## 总结

遵循 SQL 规范不仅能让代码更易读、易维护，还能减少因语法问题导致的错误。核心要点包括：统一大小写、规范命名、正确使用注释、遵循标点规则。熟练掌握这些基础，能为复杂的数据库操作打下坚实基础。                                                    

