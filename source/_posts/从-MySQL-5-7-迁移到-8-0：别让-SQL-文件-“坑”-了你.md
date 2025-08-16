---
title: 从 MySQL 5.7 迁移到 8.0：别让 SQL 文件 “坑” 了你
date: 2025-08-16 23:48:50
tags: [MySQL]
categories: [数据库]
---
# 从 MySQL 5.7 迁移到 8.0：别让 SQL 文件 “坑” 了你

最近处理了一个 MySQL 迁移的棘手问题：把 5.7 环境的数据库打包成 SQL 文件，直接在 8.0 里恢复后，各种报错接踵而至 —— 系统表引擎异常、密码修改失败、甚至服务启动崩溃。其实这类问题很常见，核心原因在于**5.7 和 8.0 的底层设计差异**，直接 “照搬” 数据很容易踩坑。今天就聊聊如何正确迁移，以及出问题后该怎么补救。

## 一、为什么 5.7 的 SQL 文件在 8.0 里会 “水土不服”？

很多人觉得 “都是 MySQL，备份恢复一下就行”，但 5.7 到 8.0 的变化远超想象，直接恢复 SQL 文件可能触发一系列连锁反应：

### 1. 引擎规则 “红线” 被触碰

5.7 中用户表默认引擎可能是 MyISAM（取决于配置），而 8.0 默认是 InnoDB。如果 SQL 文件里显式写了ENGINE=MyISAM，恢复到 8.0 后：

- 普通用户表可以用 MyISAM（8.0 仍支持，但不推荐）；

- **但如果误操作涉及系统表（如mysql.db）**，就会触发Storage engine 'MyISAM' does not support system tables错误 —— 因为 8.0 强制要求系统表必须用 InnoDB。

### 2. 系统表结构 “暗改” 了

5.7 和 8.0 的系统表（存储用户、权限的核心表）长得不一样：

- 5.7 的mysql.user表有password字段，8.0 早就改成了authentication_string；

- 权限相关的mysql.db表，字段数量和含义都有变化（比如新增了部分权限枚举值）。

如果你的 SQL 文件里不小心包含了mysql系统库的表（比如用--all-databases导出），恢复后会直接 “污染” 8.0 的系统表，导致权限加载失败。

### 3. 语法 “过期” 引发隐性错误

8.0 废弃了一些 5.7 的语法，比如：

- 密码函数PASSWORD()在 8.0 里不能用了；

- 某些索引类型和表选项（如ENGINE=MyISAM的分区表）兼容性下降。

这些语法在恢复时可能不直接报错，但会导致后续操作（如修改密码、授权）出现奇怪的失败。

## 二、正确迁移姿势：只搬 “该搬的东西”

迁移的核心原则：**只迁移业务数据，远离系统库，兼容新规则**。分四步走，稳如老狗：

### 步骤 1：导出 5.7 数据时 “精准定位”

用mysqldump导出时，只打包自己的业务库（比如mydb），坚决排除系统库：

```sql
# 在5.7环境执行，只导出业务库
mysqldump -u root -p --databases mydb --skip-lock-tables --default-character-set=utf8mb4 > mydb_backup.sql
```

⚠️ 千万别用--all-databases！会把mysql、information_schema这些系统库也导出来，堪称 “定时炸弹”。

### 步骤 2：编辑 SQL 文件，“过滤” 不兼容内容

用记事本或 VS Code 打开mydb_backup.sql，做三件事：

1. 删掉所有ENGINE=MyISAM，要么改成ENGINE=InnoDB，要么直接删掉（让 8.0 用默认引擎）；

1. 搜索并删除涉及mysql库的操作（比如USE mysql;、CREATE TABLE [mysql.xxx](http://mysql.xxx)）；

1. 把PASSWORD('密码')改成直接写密码（如'123456'），8.0 会自动用新加密方式。

### 步骤 3：在 8.0 里 “干净” 恢复

先在 8.0 里创建空库，再恢复数据，最后用官方工具修复兼容性：

```sql
# 1. 登录8.0，创建业务库
mysql -u root -p
CREATE DATABASE IF NOT EXISTS mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit

# 2. 恢复数据
mysql -u root -p mydb < mydb_backup.sql

# 快捷方式（新建了一个数据库名为mydb_backup，数据一并放入库中）
mysql -u root -p  < mydb_backup.sql

# 3. 关键：执行8.0兼容性修复（自动处理表结构差异）
mysql_upgrade -u root -p
```

### 步骤 4：验证迁移结果

恢复后登录 8.0，检查两个关键点：

```sql
-- 1. 业务表引擎是否正确（推荐InnoDB）
USE mydb;
SHOW TABLE STATUS;  -- 看Engine列，尽量都是InnoDB

-- 2. 系统表是否“纯净”（必须全是InnoDB）
USE mysql;
SHOW TABLE STATUS LIKE 'db';  -- Engine必须是InnoDB，否则有问题
```

## 三、已经 “踩坑” 了？这样补救

如果已经直接恢复了包含系统库的 SQL 文件，导致系统表异常，按以下步骤救场：

### 1. 先修复系统表

按之前提到的方法，把mysql.db、mysql.user等系统表转回 InnoDB 并重建结构：

```sql
# 以跳过权限模式启动8.0（窗口保持打开）
mysqld --console --skip-grant-tables --shared-memory

# 新窗口登录，修复引擎
mysql -u root --protocol=memory
use mysql;
ALTER TABLE db ENGINE=InnoDB;
ALTER TABLE user ENGINE=InnoDB;
FLUSH PRIVILEGES;
```

### 2. 重新迁移业务数据

- 先删除 8.0 中已恢复的业务库：DROP DATABASE mydb;；

- 按 “正确迁移步骤” 重新导出、编辑、恢复数据；

- 执行mysql_upgrade确保兼容性。

## 总结

从 MySQL 5.7 迁移到 8.0，不是简单的 “复制粘贴”。核心是要明白：**两个版本的系统表和规则已经不同，迁移时必须 “划清界限”—— 只搬业务数据，让 8.0 的系统表保持原生状态**。

记住这三句话：

- 导出时，只导业务库，不碰系统表；

- 恢复前，编辑 SQL，删兼容问题；

- 恢复后，用mysql_upgrade，扫尾保平安。

按这个思路操作，迁移过程会顺畅很多，少走很多弯路。