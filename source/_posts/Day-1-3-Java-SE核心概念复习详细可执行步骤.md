---
title: 'Day 1-3: Java SE核心概念复习详细可执行步骤'
date: 2025-08-21 20:02:45
tags:
categories: 
---
# Day 1-3: Java SE核心概念复习详细可执行步骤

**总体目标**：夯实Java基础，为后续学习打下坚实基础  
**每日学习时间**：2-3小时（建议分为上午1小时理论，晚上2小时实践）  
**学习方式**：理论学习 + 代码实践 + 练习题巩固

---

## Day 1: 集合框架深度复习

### 上午理论学习（1小时）

#### 第一步：回顾集合框架整体架构（15分钟）

**学习内容**：

- [x] 绘制集合框架继承关系图
- [ ] 理解Collection和Map两大体系
- [ ] 掌握List、Set、Queue接口的特点

**具体操作**：

1. 打开记事本，手绘集合框架UML图
2. 标记每个接口和实现类的特点
3. 记录各个集合的使用场景

**检验方式**：能够不看资料画出完整的集合框架图

#### 第二步：ArrayList vs LinkedList 原理分析（20分钟）

**学习内容**：

- [ ] ArrayList底层数组实现原理
- [ ] LinkedList双向链表结构
- [ ] 时间复杂度对比分析
- [ ] 使用场景选择策略

**具体操作**：

1. 阅读ArrayList源码中的add、get、remove方法
2. 分析LinkedList的Node结构和双向指针
3. 制作时间复杂度对比表格

**检验方式**：能够解释为什么ArrayList查找快，LinkedList插入删除快

#### 第三步：HashMap深入理解（25分钟）

**学习内容**：

- [ ] HashMap底层数组+链表+红黑树结构
- [ ] hash函数和扩容机制
- [ ] 解决哈希冲突的方法
- [ ] HashMap线程安全问题

**具体操作**：

1. 画出HashMap内部结构示意图
2. 分析put方法的执行流程
3. 理解负载因子0.75的意义
4. 学习红黑树转换条件（链表长度>8）

**检验方式**：能够手绘HashMap结构图并解释put过程

### 晚上实践编程（2小时）

#### 第一步：手写ArrayList实现（45分钟）

**任务目标**：实现基础的动态数组功能

```java
// 创建文件：MyArrayList.java
public class MyArrayList<E> {
    private Object[] elementData;
    private int size;
    private static final int DEFAULT_CAPACITY = 10;
    
    // 待实现方法：
    // 1. 构造函数
    // 2. add(E element)
    // 3. get(int index)
    // 4. remove(int index)
    // 5. size()
    // 6. 扩容方法 grow()
}
```

**具体步骤**：

1. 创建MyArrayList.java文件
2. 实现无参构造函数，初始化数组
3. 实现add方法，包含扩容逻辑
4. 实现get方法，包含边界检查
5. 实现remove方法，数组元素前移
6. 编写测试用例验证功能

**检验标准**：

- [ ] 能够正确添加元素
- [ ] 自动扩容功能正常
- [ ] 能够获取和删除指定位置元素
- [ ] 边界条件处理正确

#### 第二步：手写HashMap核心功能（45分钟）

**任务目标**：实现基础的键值对存储功能

```java
// 创建文件：MyHashMap.java
public class MyHashMap<K, V> {
    private Node<K, V>[] table;
    private int size;
    private static final int DEFAULT_CAPACITY = 16;
    
    static class Node<K, V> {
        K key;
        V value;
        Node<K, V> next;
        // 构造函数
    }
    
    // 待实现方法：
    // 1. hash(Object key)
    // 2. put(K key, V value)
    // 3. get(Object key)
    // 4. resize()
}
```

**具体步骤**：

1. 定义Node内部类表示键值对节点
2. 实现简单的hash函数
3. 实现put方法，处理哈希冲突（链表法）
4. 实现get方法，遍历链表查找
5. 实现基础的扩容逻辑
6. 编写测试用例

**检验标准**：

- [ ] 能够存储和获取键值对
- [ ] 正确处理哈希冲突
- [ ] key为null的情况处理
- [ ] 基本的扩容功能

#### 第三步：集合API熟练度练习（30分钟）

**练习内容**：

1. **ArrayList练习**：

```java
// 练习题1：移除ArrayList中的重复元素
List<Integer> list = Arrays.asList(1, 2, 2, 3, 3, 4);
// 要求：保持原有顺序，移除重复元素
```

2. **HashMap练习**：

```java
// 练习题2：统计字符串中每个字符的出现次数
String str = "hello world";
// 要求：使用HashMap统计字符频率
```

3. **LinkedList练习**：

```java
// 练习题3：使用LinkedList实现简单的队列操作
// 要求：入队、出队、查看队首元素
```

**具体步骤**：

1. 独立完成每个练习题
2. 对比不同集合类的性能
3. 记录解题思路和代码

**检验标准**：30分钟内完成所有练习，代码可运行

---

## Day 2: IO流系统掌握

### 上午理论学习（1小时）

#### 第一步：IO流体系结构梳理（20分钟）

**学习内容**：

- [ ] 字节流和字符流的区别
- [ ] 输入流和输出流的分类
- [ ] 节点流和处理流的概念
- [ ] 常用IO类的继承关系

**具体操作**：

1. 绘制IO流的分类思维导图
2. 列出常用的IO类：FileInputStream、BufferedReader等
3. 理解装饰器模式在IO中的应用

**检验方式**：能够根据需求选择合适的IO流类

#### 第二步：文件操作核心API学习（20分钟）

**学习内容**：

- [ ] File类的常用方法
- [ ] 文件和目录的创建、删除、重命名
- [ ] 文件属性的获取和设置
- [ ] 路径处理的最佳实践

**具体操作**：

1. 学习File类的构造方法和常用API
2. 掌握相对路径和绝对路径的使用
3. 了解文件分隔符的跨平台处理

**检验方式**：能够熟练使用File类进行文件操作

#### 第三步：NIO基础概念入门（20分钟）

**学习内容**：

- [ ] NIO与传统IO的区别
- [ ] Buffer、Channel、Selector核心概念
- [ ] 同步非阻塞IO的原理
- [ ] NIO的适用场景

**具体操作**：

1. 理解NIO的三大核心组件
2. 学习ByteBuffer的基本使用
3. 了解FileChannel的文件操作方式

**检验方式**：能够解释NIO相比传统IO的优势

### 晚上实践编程（2小时）

#### 第一步：基础文件操作实现（40分钟）

**任务目标**：掌握文件的读写操作

**练习1：文本文件复制程序**

```java
// 创建文件：FileCopyDemo.java
public class FileCopyDemo {
    // 方法1：使用字节流复制任意类型文件
    public static void copyWithByteStream(String src, String dest) {
        // 实现逻辑
    }
    
    // 方法2：使用字符流复制文本文件
    public static void copyWithCharStream(String src, String dest) {
        // 实现逻辑
    }
    
    // 方法3：使用缓冲流提升性能
    public static void copyWithBufferedStream(String src, String dest) {
        // 实现逻辑
    }
}
```

**具体步骤**：

1. 创建测试文件（文本文件和图片文件）
2. 实现三种不同的文件复制方法
3. 比较复制速度和资源占用
4. 添加异常处理和资源关闭

**检验标准**：

- [ ] 能够正确复制各种类型的文件
- [ ] 缓冲流版本性能明显优于普通流
- [ ] 正确处理异常和关闭资源
- [ ] 代码符合try-with-resources规范

#### 第二步：文件处理工具类开发（50分钟）

**任务目标**：开发实用的文件操作工具类

```java
// 创建文件：FileUtils.java
public class FileUtils {
    // 读取文件全部内容为字符串
    public static String readFileToString(String filePath) {
        // 实现逻辑
    }
    
    // 将字符串写入文件
    public static void writeStringToFile(String content, String filePath) {
        // 实现逻辑
    }
    
    // 按行读取文件
    public static List<String> readLines(String filePath) {
        // 实现逻辑
    }
    
    // 递归删除目录
    public static boolean deleteDirectory(File directory) {
        // 实现逻辑
    }
    
    // 获取文件大小（支持目录）
    public static long getFileSize(File file) {
        // 实现逻辑
    }
    
    // 查找指定扩展名的所有文件
    public static List<File> findFilesByExtension(String directory, String extension) {
        // 实现逻辑
    }
}
```

**具体步骤**：

1. 实现文件读写的便捷方法
2. 添加目录递归处理功能
3. 实现文件搜索和过滤功能
4. 编写完整的测试用例
5. 添加详细的异常处理

**检验标准**：

- [ ] 所有方法功能正确
- [ ] 能够处理大文件（内存优化）
- [ ] 异常处理完善
- [ ] 测试覆盖各种场景

#### 第三步：网络IO编程入门（30分钟）

**任务目标**：实现简单的网络通信程序

**练习：简单的Echo服务器和客户端**

```java
// 创建文件：EchoServer.java
public class EchoServer {
    public static void main(String[] args) {
        // 实现服务器端逻辑
        // 监听端口，接收客户端连接
        // 读取客户端消息并原样返回
    }
}

// 创建文件：EchoClient.java
public class EchoClient {
    public static void main(String[] args) {
        // 实现客户端逻辑
        // 连接服务器
        // 发送消息并接收回复
    }
}
```

**具体步骤**：

1. 实现单线程Echo服务器
2. 实现对应的客户端程序
3. 测试连接和消息传递
4. 优化为多线程版本（时间允许）

**检验标准**：

- [ ] 服务器能够正常启动和监听
- [ ] 客户端能够连接并通信
- [ ] 正确处理连接异常
- [ ] 资源正确释放

---

## Day 3: 多线程编程深入

### 上午理论学习（1小时）

#### 第一步：线程基础概念复习（20分钟）

**学习内容**：

- [ ] 进程与线程的区别
- [ ] 线程的生命周期状态
- [ ] Thread类和Runnable接口
- [ ] 线程的创建方式对比

**具体操作**：

1. 绘制线程状态转换图
2. 比较继承Thread和实现Runnable的差异
3. 学习Callable和Future接口

**检验方式**：能够解释线程状态转换过程

#### 第二步：线程安全问题分析（20分钟）

**学习内容**：

- [ ] 什么是线程安全问题
- [ ] 竞态条件和临界区概念
- [ ] 内存可见性问题
- [ ] 指令重排序问题

**具体操作**：

1. 分析经典的银行转账线程安全问题
2. 理解volatile关键字的作用
3. 学习happens-before原则

**检验方式**：能够识别代码中的线程安全问题

#### 第三步：同步机制深入学习（20分钟）

**学习内容**：

- [ ] synchronized关键字的使用
- [ ] Lock接口和ReentrantLock
- [ ] 读写锁ReadWriteLock
- [ ] 条件变量Condition

**具体操作**：

1. 学习synchronized的三种使用方式
2. 比较synchronized和Lock的差异
3. 理解可重入锁的概念

**检验方式**：能够选择合适的同步机制解决问题

### 晚上实践编程（2小时）

#### 第一步：线程创建和基础操作（30分钟）

**任务目标**：熟练掌握线程的创建和控制

**练习1：多种方式创建线程**

```java
// 创建文件：ThreadCreationDemo.java
public class ThreadCreationDemo {
    // 方式1：继承Thread类
    static class MyThread extends Thread {
        @Override
        public void run() {
            // 实现线程逻辑
        }
    }
    
    // 方式2：实现Runnable接口
    static class MyRunnable implements Runnable {
        @Override
        public void run() {
            // 实现线程逻辑
        }
    }
    
    // 方式3：使用Callable和Future
    static class MyCallable implements Callable<String> {
        @Override
        public String call() throws Exception {
            // 实现有返回值的线程逻辑
            return "result";
        }
    }
    
    // 方式4：使用线程池
    public static void testThreadPool() {
        // 使用ExecutorService创建线程池
    }
}
```

**具体步骤**：

1. 实现四种不同的线程创建方式
2. 测试线程的启动、等待、中断
3. 比较各种方式的优缺点
4. 学习线程池的基本使用

**检验标准**：

- [ ] 所有创建方式都能正常工作
- [ ] 理解每种方式的适用场景
- [ ] 能够正确处理线程异常
- [ ] 掌握线程池的基本配置

#### 第二步：线程安全编程实践（50分钟）

**任务目标**：解决实际的线程安全问题

**练习1：银行账户转账系统**

```java
// 创建文件：BankAccount.java
public class BankAccount {
    private double balance;
    private final Object lock = new Object();
    
    public void deposit(double amount) {
        // 实现存款方法（线程安全）
    }
    
    public boolean withdraw(double amount) {
        // 实现取款方法（线程安全）
    }
    
    public void transfer(BankAccount target, double amount) {
        // 实现转账方法（避免死锁）
    }
    
    public double getBalance() {
        // 实现余额查询（线程安全）
    }
}

// 创建文件：BankTest.java
public class BankTest {
    public static void main(String[] args) {
        // 测试多线程并发访问账户
        // 验证数据一致性
    }
}
```

**具体步骤**：

1. 实现线程安全的银行账户类
2. 创建多个线程并发执行转账操作
3. 验证最终余额的正确性
4. 优化转账方法避免死锁问题

**练习2：生产者消费者模式**

```java
// 创建文件：ProducerConsumer.java
public class ProducerConsumer {
    private final Queue<Integer> queue = new LinkedList<>();
    private final int maxSize = 10;
    private final Object lock = new Object();
    
    class Producer implements Runnable {
        @Override
        public void run() {
            // 实现生产者逻辑
        }
    }
    
    class Consumer implements Runnable {
        @Override
        public void run() {
            // 实现消费者逻辑
        }
    }
}
```

**具体步骤**：

1. 实现生产者消费者模式
2. 使用wait()和notify()进行线程协调
3. 测试多生产者多消费者场景
4. 优化为使用Lock和Condition

**检验标准**：

- [ ] 银行转账系统数据一致性正确
- [ ] 转账过程无死锁发生
- [ ] 生产者消费者能够正确协调工作
- [ ] 队列大小限制有效

#### 第三步：线程池深入应用（40分钟）

**任务目标**：掌握线程池的配置和使用

**练习：多任务处理系统**

```java
// 创建文件：TaskProcessor.java
public class TaskProcessor {
    // 创建不同类型的线程池
    private ExecutorService fixedThreadPool;
    private ExecutorService cachedThreadPool;
    private ScheduledExecutorService scheduledPool;
    
    // 处理CPU密集型任务
    public void processCPUIntensiveTask() {
        // 实现CPU密集型任务处理
    }
    
    // 处理IO密集型任务
    public void processIOIntensiveTask() {
        // 实现IO密集型任务处理
    }
    
    // 定时任务处理
    public void scheduleTask() {
        // 实现定时任务
    }
    
    // 批量任务处理
    public List<String> processBatchTasks(List<String> tasks) {
        // 使用CompletionService处理批量任务
    }
}
```

**具体步骤**：

1. 创建不同类型的线程池
2. 实现CPU密集型和IO密集型任务
3. 使用ScheduledExecutorService创建定时任务
4. 实现批量任务处理和结果收集
5. 添加线程池监控和异常处理

**检验标准**：

- [ ] 能够根据任务特点选择合适的线程池
- [ ] 定时任务能够正确执行
- [ ] 批量任务处理效率高
- [ ] 线程池参数配置合理
- [ ] 正确关闭线程池释放资源

---

## 三天学习成果验收

### 综合练习项目：多线程文件处理器

**项目目标**：结合集合、IO、多线程知识开发实用工具

**功能要求**：

1. 扫描指定目录下的所有文件
2. 使用多线程并行处理文件（如计算MD5、统计行数等）
3. 将处理结果保存到数据结构中
4. 支持实时显示处理进度
5. 处理结果导出为文件

**技术要点**：

- [ ] 使用File类递归扫描目录
- [ ] 用ThreadPoolExecutor处理文件
- [ ] 使用ConcurrentHashMap存储结果
- [ ] 实现线程安全的进度统计
- [ ] 使用BlockingQueue协调任务

**验收标准**：

- [ ] 能够正确扫描和处理文件
- [ ] 多线程处理提升明显性能
- [ ] 程序运行稳定无死锁
- [ ] 进度显示准确
- [ ] 结果数据正确完整

### 知识点测试清单

**集合框架**：

- [ ] 能够选择合适的集合类解决问题
- [ ] 理解HashMap的工作原理
- [ ] 掌握ArrayList和LinkedList的适用场景

**IO流系统**：

- [ ] 熟练使用各种IO流进行文件操作
- [ ] 能够开发文件处理工具
- [ ] 理解NIO的基本概念

**多线程编程**：

- [ ] 掌握多种线程创建方式
- [ ] 能够解决线程安全问题
- [ ] 熟练使用线程池处理并发任务

### 下一步学习建议

完成Day 1-3的学习后，应该：

1. **每日复习**：每天花15分钟回顾已学内容
2. **知识关联**：思考这些基础知识在实际项目中的应用
3. **持续练习**：继续在LeetCode上练习相关算法题
4. **准备面试**：整理常见面试题的答案

**常见面试题准备**：

- HashMap的实现原理和扩容机制
- ArrayList和LinkedList的区别
- volatile关键字的作用
- synchronized和Lock的区别
- 线程池的核心参数含义
- 如何解决死锁问题