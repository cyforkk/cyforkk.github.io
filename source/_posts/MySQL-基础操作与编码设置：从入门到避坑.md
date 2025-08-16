---
title: MySQL 基础操作与编码设置：从入门到避坑
date: 2025-08-16 10:14:17
tags: [MySQL]
categories: [数据库]
---
# MySQL 基础操作与编码设置：从入门到避坑

掌握 MySQL 的基础操作是使用数据库的第一步，而字符集设置不当导致的乱码问题则是新手常踩的 “坑”。本文从实际操作出发，带你快速上手数据库基本操作，并解决中文存储的常见问题。

## 一、MySQL 基础操作：从数据库到表的核心命令

### 1. 查看所有数据库

登录 MySQL 后，首先可以查看当前服务器中的所有数据库：

```sql
SHOW DATABASES;
```

系统默认包含 4 个核心数据库：

- information_schema：存储数据库元信息（如库名、表名、字段类型等）；

- performance_schema：用于监控数据库性能；

- sys：简化性能监控的视图集合；

- mysql：存储用户权限、系统配置等核心信息。

### 2. 创建自己的数据库

使用create database命令创建自定义数据库，名称需唯一：

```sql
-- 创建名为cyforkkdb的数据库
CREATE DATABASE cyforkkdb;
```

### 3. 切换到目标数据库

对数据库操作前需先指定目标库，使用use命令：

```sql
-- 切换到cyforkkdb数据库
USE cyforkkdb;
```

> 提示：若未执行use命令直接操作表，会报错No database selected。

### 4. 查看数据库中的表

切换到目标库后，查看所有表：

```SQL
-- 查看当前数据库的表
show tables;
SHOW TABLES;

-- 查看指定数据库的表（无需切换库）
 SHOW TABLES FORM 数据库名;
```

### 5. 创建数据表

使用create table定义表结构，需指定字段名和数据类型：

```sql
-- 创建student表（包含id和name字段）
CREATE TABLE student(
  id int,  -- 整数类型
  name varchar(20)  -- 字符串类型，最长20个字符
);

```

### 6. 查看表数据

新表默认无数据，可通过select命令查看：

```sql
-- 查看student表的所有数据
SELECT * FROM student;

```

### 7. 插入数据

使用insert into添加记录：

```sql
-- 向student表插入两条记录
INSERT INTO student VALUES(1, '张三');
INSERT INTO student VALUES(2, '李四');

```

> 注意：若插入中文时出现Incorrect string value错误，大概率是字符集不支持中文，需按后文方法配置。

### 8. 查看表 / 库的创建信息

通过show create命令可查看表或数据库的详细配置（包括字符集）：

```sql
-- 查看student表的创建信息（\G用于格式化输出）
SHOW CREATE TABLE student\G


-- 查看cyforkkdb数据库的创建信息
SHOW CREATE DATABASE cyforkkdb\G
```

### 9. 删除表和数据库

删除操作需谨慎，执行后数据无法恢复：

```sql
-- 删除student表
DROP TABLE student;


-- 删除atguigudb数据库
DROP DATABASE cyforkkdb;
```

## 二、字符集设置：解决中文乱码问题

### 1. 问题表现

插入中文时提示ERROR 1366 (HY000): Incorrect string value，或查询时显示乱码，本质是字符集不支持中文（默认latin1）。

### 2. 查看当前字符集

通过以下命令检查字符集配置：

```sql
-- 查看字符集相关变量
SHOW VARIABLES LIKE 'character_%';
SHOW VARIABLES LIKE 'collation_%';
```

### 3. MySQL 5.7 配置方法

#### 步骤 1：修改配置文件my.ini

找到安装目录下的my.ini（默认路径：C:\ProgramData\MySQL\MySQL Server 5.7），添加以下配置：

```sql
[mysql]
default-character-set=utf8  -- 客户端默认字符集

[mysqld]
character-set-server=utf8  -- 服务器默认字符集
collation-server=utf8_general_ci  -- 服务器默认排序规则
```

#### 步骤 2：重启服务

```
-- 停止服务（mysql57是服务名）
net stop mysql57

-- 启动服务
net start mysql57
```

#### 步骤 3：验证配置

重新登录后执行show variables like 'character_%';，确认character_set_server等参数为utf8。

### 4. MySQL 8.0 的优势

MySQL 8.0 默认字符集为utf8mb4（支持所有中文、emoji 和生僻字），无需手动配置即可正常存储中文，从根源解决乱码问题。

### 5. 已有库 / 表的字符集修改

若修改配置前已创建库或表，需手动调整：

```sql
-- 修改数据库字符集
ALTER DATABASE 数据库名 charset utf8;

-- 修改表字符集（仅影响新字段）
ALTER TABLE 表名 charset utf8;

-- 修改字段字符集（需指定字段类型）
ALTER TABLE 表名 MODIFY 字段名 varchar(20) charset utf8;
```

## 总结

MySQL 基础操作围绕 “库 - 表 - 数据” 三层结构展开，核心命令包括create、use、insert、select等。中文乱码问题的关键是字符集配置，MySQL 5.7 需手动修改my.ini为utf8，而 8.0 默认utf8mb4更省心。掌握这些内容，即可完成日常数据存储与查询需求。