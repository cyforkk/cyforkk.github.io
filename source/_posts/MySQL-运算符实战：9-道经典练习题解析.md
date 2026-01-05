---
title: MySQL 运算符实战：9 道经典练习题解析
date: 2025-08-18 11:33:41
tags: [MySQL]
categories: [数据库]
---
# MySQL 运算符实战：9 道经典练习题解析

运算符是 MySQL 查询的 “灵魂”，灵活运用各类运算符能让数据筛选更加精准高效。本文通过 9 道实战练习题，详解逻辑运算符、比较运算符及模糊匹配的用法，帮你快速掌握运算符的核心应用场景。

## 一、范围查询：NOT BETWEEN 与 OR 的灵活运用

### 题目 1：选择工资不在 5000 到 12000 的员工的姓名和工资

#### 解决方案

```sql
-- 方法1：使用OR逻辑运算符
SELECT last_name, salary
FROM employees
WHERE salary < 5000 OR salary > 12000;

-- 方法2：使用NOT BETWEEN（更简洁）
SELECT last_name, salary
FROM employees
WHERE salary NOT BETWEEN 5000 AND 12000;
```

#### 知识点解析

- **BETWEEN AND**：表示闭区间范围（包含边界值），salary BETWEEN 5000 AND 12000 等价于 salary >= 5000 AND salary <= 12000；

- **NOT 取反**：NOT BETWEEN 直接排除范围内的数据，比 OR 更简洁，可读性更高；

- **适用场景**：连续范围的反向筛选，优先用 NOT BETWEEN。

## 二、集合查询：IN 与 OR 的效率对比

### 题目 2：选择在 20 或 50 号部门工作的员工姓名和部门号

#### 解决方案

```sql
-- 方法1：使用OR逻辑运算符
SELECT last_name, department_id
FROM employees
WHERE department_id = 20 OR department_id = 50;

-- 方法2：使用IN集合运算符（推荐）
SELECT last_name, department_id
FROM employees
WHERE department_id IN (20, 50);
```

#### 知识点解析

- **IN 运算符**：用于匹配离散的多个值，IN (20,50) 等价于 =20 OR =50，但代码更简洁；

- **性能优势**：当集合元素较多（如 10 个以上），IN 的执行效率通常高于多个 OR 拼接；

- **注意**：IN 列表中若包含 NULL，不会影响非 NULL 值的匹配，但结果可能包含 NULL。

## 三、NULL 值处理：IS NULL 与 IS NOT NULL

### 题目 3：选择公司中没有管理者的员工姓名及 job_id

#### 解决方案

```sql
SELECT last_name, job_id
FROM employees
WHERE manager_id IS NULL;
```

### 题目 4：选择公司中有奖金的员工姓名、工资和奖金级别

#### 解决方案

```sql
SELECT last_name, salary, commission_pct
FROM employees
WHERE commission_pct IS NOT NULL;
```

#### 知识点解析

- **NULL 的特殊性**：NULL 表示 “未知值”，不能用 = 或 != 判断，必须用 IS NULL（为空）或 IS NOT NULL（非空）；

- **应用场景**：判断字段是否未填写（如管理者 ID、奖金比例），避免因 NULL 导致的筛选遗漏；

- **注意**：IFNULL(commission_pct, 0) 可将 NULL 转换为 0（如计算年薪时），但筛选时仍需用 IS NOT NULL。

## 四、模糊匹配：LIKE 通配符的精准用法

### 题目 5：选择员工姓名的第三个字母是 a 的员工姓名

#### 解决方案

```
SELECT last_name
FROM employees
WHERE last_name LIKE '__a%';
```

#### 解析

- **LIKE 通配符**：_ 匹配单个任意字符，% 匹配 0 个或多个任意字符；

- **模式说明**：__a% 表示前两个字符任意，第三个字符为a，后续字符不限（__ 对应两个位置）。

### 题目 6：选择姓名中有字母 a 和 k 的员工姓名

#### 解决方案

```
SELECT last_name
FROM employees
WHERE last_name LIKE '%a%k%' OR last_name LIKE '%k%a%';
```

#### 解析

- **多条件模糊匹配**：需考虑两种顺序（a在前k在后或k在前a在后），用 OR 连接；

- **注意**：% 可匹配任意长度字符（包括 0），确保不遗漏包含两个字符的所有情况。

### 题目 7：显示表 employees 中 first_name 以 'e' 结尾的员工信息

#### 解决方案

```sql
-- 方法1：使用LIKE
SELECT employee_id, first_name, last_name
FROM employees
WHERE first_name LIKE '%e';

-- 方法2：使用REGEXP正则（更灵活）
SELECT employee_id, first_name, last_name
FROM employees
WHERE first_name REGEXP 'e$';
```

#### 解析

- **结尾匹配**：%e 表示以e结尾（LIKE），e$ 表示以e结尾（REGEXP正则）；

- **REGEXP 优势**：支持更复杂的模式（如多字符结尾），适合高级字符串匹配。

## 五、区间与集合综合运用

### 题目 8：显示表 employees 部门编号在 80-100 之间的姓名、工种

#### 解决方案

```sql
SELECT last_name, job_id
FROM employees
WHERE department_id BETWEEN 80 AND 100;
```

#### 解析

- **连续区间优选 BETWEEN**：BETWEEN 80 AND 100 等价于 >=80 AND <=100，代码更简洁；

- **注意**：区间包含边界值（80 和 100），若需排除边界需用 > 和 <。

### 题目 9：显示表 employees 的 manager_id 是 100、101、110 的员工姓名、工资、管理者 id

#### 解决方案

```sql
SELECT last_name, salary, manager_id
FROM employees
WHERE manager_id IN (100, 101, 110);
```

#### 解析

- **离散值集合用 IN**：IN (100,101,110) 清晰表达 “属于指定集合”，比 =100 OR =101 OR =110 更易读；

- **扩展**：若集合元素来自子查询，可写成 IN (SELECT ...)，实现动态匹配。

## 总结：运算符核心用法速查表

| 运算符 / 语法   | 作用                        | 典型场景                       |
| --------------- | --------------------------- | ------------------------------ |
| BETWEEN A AND B | 匹配 A 到 B 的闭区间        | 工资、年龄等连续范围查询       |
| NOT BETWEEN     | 排除 A 到 B 的区间          | 反向范围筛选                   |
| IN (值1,值2...) | 匹配离散集合中的值          | 部门 ID、管理者 ID 等固定选项  |
| IS NULL         | 判断字段为空                | 查找未分配管理者、无奖金的记录 |
| IS NOT NULL     | 判断字段非空                | 查找有奖金、已填写信息的记录   |
| LIKE '%a%'      | 模糊匹配包含 a 的字符串     | 姓名、职位等包含特定字符的查询 |
| LIKE '__a%'     | 匹配第三个字符为 a 的字符串 | 固定位置字符匹配               |
| REGEXP 'e$'     | 正则匹配以 e 结尾的字符串   | 复杂模式的字符串匹配           |

通过这 9 道题，可掌握运算符在实际场景中的灵活应用。记住：优先用 IN 替代多 OR、用 BETWEEN 简化连续范围、用 IS NULL 处理空值，能让你的 SQL 更简洁高效。