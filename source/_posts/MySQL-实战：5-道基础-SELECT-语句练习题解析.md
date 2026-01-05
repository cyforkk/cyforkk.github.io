---
title: MySQL 实战：5 道基础 SELECT 语句练习题解析
date: 2025-08-19 08:49:28
tags: [MySQL]
categories: [数据库]
---
# MySQL 实战：5 道基础 SELECT 语句练习题解析

在 MySQL 学习中，实战练习是掌握基础语法的关键。本文通过 5 道经典 SELECT 语句练习题，带你巩固查询操作的核心知识点，从简单查询到条件筛选，逐步提升 SQL 应用能力。

## 一、计算员工年薪（算术运算与别名）

### 需求

查询员工 12 个月的工资总和，并起别名为ANNUAL SALARY。

### 解决方案

```sql
-- 基础版：仅计算基本工资的年薪
SELECT employee_id, last_name, salary * 12 "ANNUAL SALARY"
FROM employees;

-- 进阶版：包含佣金的年薪（处理NULL值）
SELECT employee_id, last_name, 
       salary * 12 * (1 + IFNULL(commission_pct, 0)) "ANNUAL SALARY"
FROM employees;
```

### 知识点解析

1. **算术运算**：salary * 12 实现月工资到年薪的转换，* 为乘法运算符；

1. **别名**：用双引号 "" 定义别名 ANNUAL SALARY（含空格需加引号）；

1. **NULL 处理**：IFNULL(commission_pct, 0) 将佣金率（可能为 NULL）转换为 0，避免因NULL * 数值导致结果为 NULL。

## 二、查询去重的职位 ID（DISTINCT 关键字）

### 需求

查询employees表中去除重复的job_id以后的数据。

### 解决方案

```sql
SELECT DISTINCT job_id
FROM employees;
```

### 知识点解析

- **DISTINCT 作用**：对其后的字段（此处为job_id）进行去重，仅保留唯一值；

- **注意**：DISTINCT 作用于所有指定字段，若写 SELECT DISTINCT job_id, department_id，则对两个字段的组合去重。

## 三、筛选高工资员工（WHERE 条件过滤）

### 需求

查询工资大于 12000 的员工姓名和工资。

### 解决方案

```sql
SELECT last_name, salary
FROM employees
WHERE salary > 12000;
```

### 知识点解析

- **WHERE 子句**：用于筛选符合条件的记录，紧跟FROM子句；

- **比较运算符**：> 表示 “大于”，其他常用比较符有 <、>=、<=、= 等；

- **性能建议**：若salary字段有索引，WHERE salary > 12000可利用索引提升查询效率。

## 四、查询指定员工信息（精确匹配）

### 需求

查询员工号为 176 的员工的姓名和部门号。

### 解决方案

```sql
SELECT last_name, department_id
FROM employees
WHERE employee_id = 176;
```

### 知识点解析

- **精确匹配**：= 用于判断字段值与指定值是否相等（此处employee_id为整数，直接写数值即可）；

- **主键查询**：employee_id通常为主键，主键查询效率极高，因为主键默认是唯一索引。

## 五、查看表结构与全量数据（DESC 与 SELECT *）

### 需求

显示表departments的结构，并查询其中的全部数据。

### 解决方案

```sql
-- 显示表结构
DESC departments;  -- 或使用 DESCRIBE departments;

-- 查询全部数据（仅建议在测试环境使用）
SELECT * FROM departments;
```

### 知识点解析

1. **DESC 命令**：查看表的字段信息，包括字段名（Field）、类型（Type）、是否允许 NULL（Null）、索引（Key）等；

1. **SELECT ***：返回表中所有字段的全部记录，缺点是效率低（尤其大表）且结构变更时易出错，**生产环境不推荐**。

## 总结：基础查询的核心要点

1. **算术运算**：支持+、-、*、/，注意用IFNULL处理NULL值；

1. **去重**：DISTINCT 用于提取唯一值，作用于其后所有字段；

1. **条件筛选**：WHERE 子句结合比较运算符（>、=等）实现精准过滤；

1. **表结构查看**：DESC 命令快速了解表设计；

1. **别名规范**：用双引号定义含特殊字符的别名，提升结果可读性。

通过这 5 道题，可掌握 SELECT 语句的基本用法。实际开发中，需根据业务需求灵活组合这些技巧，同时注意查询效率和代码规范性。