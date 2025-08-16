---
title: LinkedHashMap、HashSet、LinkedHashSet 深度解析：从源码到实战
date: 2025-08-11 21:11:13
tags: [JAVA,集合]
categories: [编程语言]
---
# LinkedHashMap、HashSet、LinkedHashSet 深度解析：从源码到实战

在 Java 集合框架中，LinkedHashMap、HashSet 和 LinkedHashSet 是基于 HashMap 衍生出的高频使用类。它们看似独立，实则底层紧密关联，各自在 "有序性" 和 "去重性" 上形成互补。本文将从源码实现入手，解析三者的设计逻辑与适用场景，帮你在开发中精准选型。

## 一、LinkedHashMap：HashMap 的 "有序升级版"

LinkedHashMap 是 HashMap 的子类，核心优势是**支持有序存储**，通过维护双向链表记录元素顺序，完美解决了 HashMap"无序" 的痛点。

### 1. 底层结构：HashMap + 双向链表

LinkedHashMap 的底层由两部分组成：

- **哈希表**：继承自 HashMap 的 "数组 + 链表 + 红黑树" 结构，保证键值对的高效存取；

- **双向链表**：额外维护一条贯穿所有节点的双向链表，记录元素的插入顺序或访问顺序。

节点结构在 HashMap 的 Node 基础上新增了两个指针：

```java
static class Entry<K,V> extends HashMap.Node<K,V> {
    Entry<K,V> before, after; // 双向链表指针
    Entry(int hash, K key, V value, Node<K,V> next) {
        super(hash, key, value, next);
    }
}
```

### 2. 核心特性：两种有序模式

LinkedHashMap 通过accessOrder属性控制有序性（默认false）：

- **插入顺序（accessOrder=false）**：迭代时与元素插入顺序一致，新增元素放在链表尾部。

```java
Map<String, Integer> map = new LinkedHashMap<>();
map.put("b", 2);
map.put("a", 1);
map.put("c", 3);
// 迭代结果：b→a→c（与插入顺序相同）
```

- **访问顺序（accessOrder=true）**：调用get、put等方法访问元素后，该元素会被移到链表尾部（最近访问的元素在尾部），天然适配 LRU（最近最少使用）缓存场景。

### 3. 关键方法：实现 LRU 缓存

通过重写removeEldestEntry方法，可自定义 "当新增元素后是否删除最老元素"：

```java
// 实现容量为3的LRU缓存
Map<String, Integer> lruCache = new LinkedHashMap<>(16, 0.75f, true) {
    @Override
    protected boolean removeEldestEntry(Map.Entry<String, Integer> eldest) {
        return size() > 3; // 超过3个元素则删除最老的
    }
};
```

### 4. 与 HashMap 的核心差异

| 特性     | HashMap         | LinkedHashMap                |
| -------- | --------------- | ---------------------------- |
| 有序性   | 无序            | 支持插入顺序 / 访问顺序      |
| 性能     | 插入 / 删除略快 | 因维护双向链表，迭代效率更高 |
| 内存占用 | 较低            | 较高（多维护双向链表指针）   |

## 二、HashSet：基于 HashMap 的 "去重容器"

HashSet 是专门用于**元素去重**的集合，底层完全依赖 HashMap 实现，可理解为 "只存 key 的 HashMap"。

### 1. 底层实现：HashMap 的包装类

HashSet 内部持有一个 HashMap 实例，所有操作均通过该 map 完成：

```java
public class HashSet<E> {
    private transient HashMap<E, Object> map;
    private static final Object PRESENT = new Object(); // 固定value

    public HashSet() {
        map = new HashMap<>();
    }

    // 添加元素本质是map的put操作
    public boolean add(E e) {
        return map.put(e, PRESENT) == null; // key存在则返回false
    }
}
```

### 2. 核心特性

- **去重规则**：与 HashMap 的 key 一致 —— 两个元素hashCode相等且equals返回 true，则视为重复。

- **无序性**：存储顺序与插入顺序无关（同 HashMap 的 key 特性）。

- **允许 null 元素**：但仅能存一个（null 的 hashCode 固定为 0）。

### 3. 基础用法示例

```java
Set<String> set = new HashSet<>();
set.add("apple");
set.add("banana");
set.add("apple"); // 重复元素，添加失败
System.out.println(set.size()); // 输出2

// 遍历（无序）
for (String s : set) {
    System.out.println(s); // 顺序不确定
}
```

## 三、LinkedHashSet：HashSet 的 "有序版"

LinkedHashSet 是 HashSet 的子类，底层依赖 LinkedHashMap 实现，同时具备**去重性**和**插入顺序性**。

### 1. 底层实现：LinkedHashMap 的包装类

与 HashSet 类似，LinkedHashSet 通过父类构造器初始化 LinkedHashMap：

```java
public class LinkedHashSet<E> extends HashSet<E> {
    public LinkedHashSet() {
        // 调用HashSet的构造器，实际创建LinkedHashMap
        super(16, 0.75f, true);
    }
}

// HashSet中对应的构造器
HashSet(int initialCapacity, float loadFactor, boolean dummy) {
    map = new LinkedHashMap<>(initialCapacity, loadFactor);
}
```

### 2. 核心特性

- **有序性**：默认按插入顺序排序（迭代时与插入顺序一致），且顺序不随元素访问变化（区别于 LinkedHashMap 的访问顺序）。

- **去重性**：与 HashSet 一致，依赖 LinkedHashMap 的 key 去重逻辑。

### 3. 用法示例

```java
Set<String> linkedSet = new LinkedHashSet<>();
linkedSet.add("b");
linkedSet.add("a");
linkedSet.add("c");
// 遍历（按插入顺序）
for (String s : linkedSet) {
    System.out.println(s); // 输出：b→a→c
}
```

## 四、三者对比与实战选型

### 1. 核心差异对比表

| 集合类型      | 底层依赖           | 有序性              | 去重性   | 典型应用场景                     |
| ------------- | ------------------ | ------------------- | -------- | -------------------------------- |
| LinkedHashMap | HashMap + 双向链表 | 插入顺序 / 访问顺序 | 键唯一   | LRU 缓存、有序映射、历史记录     |
| HashSet       | HashMap            | 无序                | 元素唯一 | 标签去重、快速判重               |
| LinkedHashSet | LinkedHashMap      | 插入顺序            | 元素唯一 | 有序去重（如日志记录、流程步骤） |

### 2. 实战选型建议

- **需要键值对且有序**：用 LinkedHashMap（如配置参数按插入顺序输出）。

- **仅需元素去重且无序**：用 HashSet（如用户标签去重）。

- **需去重且保留插入顺序**：用 LinkedHashSet（如接口调用参数记录）。

- **高频迭代操作**：优先选 LinkedHashMap/LinkedHashSet（迭代效率更高）。

- **内存敏感场景**：优先选 HashMap/HashSet（内存占用更低）。

## 总结

LinkedHashMap、HashSet 和 LinkedHashSet 的设计充分体现了 Java 集合框架的 "复用性" 思想：

- 给 HashMap 加双向链表，得到支持有序的 LinkedHashMap；

- 封装 HashMap 的 key，得到用于去重的 HashSet；

- 用 LinkedHashMap 替代 HashMap，得到有序去重的 LinkedHashSet。

理解这种 "基于已有实现扩展功能" 的设计思路，不仅能帮你快速掌握 API 用法，更能在实际开发中学会 "站在巨人肩膀上" 设计简洁高效的代码。记住：没有最好的集合，只有最适合场景的选择。