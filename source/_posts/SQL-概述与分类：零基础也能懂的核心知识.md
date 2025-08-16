---
title: SQL 概述与分类：零基础也能懂的核心知识
date: 2025-08-14 15:55:10
tags: [MySQL]
categories: [数据库]
---
# SQL 概述与分类：零基础也能懂的核心知识

无论学习哪种数据库（MySQL、Oracle、SQL Server），SQL 都是绕不开的基础。它是操作数据库的 “通用语言”，掌握其核心概念和分类，能让你在写代码时思路更清晰。本文用最简单的语言讲解 SQL 的本质和分类，新手也能快速入门。

## 一、什么是 SQL？一句话讲明白

SQL（Structured Query Language，结构化查询语言）是一种**专门用来操作数据库的编程语言**。它的作用就像 “数据库的遥控器”—— 通过简单的命令，你可以让数据库执行 “查数据”“存数据”“建表”“改权限” 等操作。

### SQL 的 3 个核心特点：

- **标准化**：几乎所有数据库（MySQL、Oracle 等）都支持 SQL，学会一种，其他数据库的 SQL 用法也大同小异。

- **非过程化**：你只需要告诉数据库 “要做什么”（比如 “查所有学生的名字”），不用管 “怎么做”（数据库会自己优化执行步骤）。

- **简单易学**：基本命令都是英文单词（如SELECT“查询”、INSERT“插入”），逻辑和日常语言接近。

## 二、SQL 分类：5 大类命令，各司其职

根据功能不同，SQL 可以分为 5 大类。记住每类的核心命令和作用，写 SQL 时就不会 “无从下手”。

### 1. 数据查询语言（DQL）：查数据的 “放大镜”

**作用**：从数据库中查询数据（最常用的一类命令）。

**核心命令**：SELECT（唯一命令，但用法灵活）。

**示例**：

```SQL
-- 从student表中查询所有学生的姓名和年龄
SELECT name, age FROM student;

-- 查询年龄大于18的学生
SELECT * FROM student WHERE age > 18;
```

### 2. 数据操纵语言（DML）：改数据的 “编辑工具”

**作用**：对表中的数据进行 “增删改”（不改变表结构，只改内容）。

**核心命令**：INSERT（新增）、UPDATE（修改）、DELETE（删除）。

**示例**：

```SQL
-- 新增一条学生数据
INSERT INTO student (name, age) VALUES ('张三', 20);

-- 修改张三的年龄为21
UPDATE student SET age = 21 WHERE name = '张三';

-- 删除年龄小于18的学生
DELETE FROM student WHERE age < 18;
```

### 3. 数据定义语言（DDL）：建结构的 “建筑师”

**作用**：创建、修改、删除数据库或表的结构（比如建表、删库、改字段类型）。

**核心命令**：CREATE（创建）、ALTER（修改）、DROP（删除）。

**示例**：

```SQL
-- 创建名为school的数据库
CREATE DATABASE school;

-- 在school库中创建student表（包含id和name字段）
CREATE TABLE student (
  id INT,
  name VARCHAR(20)
);

-- 给student表增加age字段
ALTER TABLE student ADD age INT;

-- 删除student表（谨慎使用！数据会丢失）
DROP TABLE student;
```

### 4. 数据控制语言（DCL）：管权限的 “保安”

**作用**：控制用户对数据库的操作权限（比如 “允许张三查 student 表，不允许他删表”）。

**核心命令**：GRANT（授权）、REVOKE（收回权限）。

**示例**：

```SQL
-- 允许用户zhangsan查询student表
GRANT SELECT ON school.student TO 'zhangsan'@'localhost';

-- 收回zhangsan查询student表的权限
REVOKE SELECT ON school.student FROM 'zhangsan'@'localhost';
```

### 5. 事务控制语言（TCL）：保安全的 “后悔药”

**作用**：管理数据库事务（确保一组操作要么全成功，要么全失败，比如转账时 “扣钱” 和 “加钱” 必须同时成功）。

**核心命令**：COMMIT（提交事务）、ROLLBACK（回滚事务，即 “撤销操作”）。

**示例**：

```SQL
-- 开启事务（MySQL默认自动提交，需手动关闭）
SET autocommit = 0;

-- 执行转账操作（扣A的钱，加B的钱）
UPDATE account SET money = money - 100 WHERE name = 'A';
UPDATE account SET money = money + 100 WHERE name = 'B';

-- 确认操作无误，提交事务（数据永久生效）
COMMIT;

-- 若操作出错，回滚事务（恢复到操作前的状态）
ROLLBACK;
```

## 三、总结：记分类，更要会用

SQL 分类的核心是 “按功能记命令”：

- 查数据 → 想SELECT（DQL）；

- 改数据内容 → 想INSERT/UPDATE/DELETE（DML）；

- 改表 / 库结构 → 想CREATE/ALTER/DROP（DDL）；

- 管权限 → 想GRANT/REVOKE（DCL）；

- 保证操作安全 → 想COMMIT/ROLLBACK（TCL）。

掌握这些分类，后续学习复杂 SQL 时会更有条理。下一篇我们会深入讲解最常用的 DQL（查询命令），带你搞定各种数据查询场景。