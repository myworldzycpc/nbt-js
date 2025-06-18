# SNBT 数据处理库技术文档

## 概述
该 JavaScript 库提供了完整的 NBT（Named Binary Tag）数据格式处理能力，包括 NBT 数据的解析、创建、修改和序列化功能。NBT 是 Minecraft 中广泛使用的一种二进制数据格式，用于存储和传输结构化数据。

## 主要功能
- 完整支持 NBT 数据类型（对象、列表、整数数组、数字、字符串、布尔值和空值）
- 支持带语法高亮的 NBT 字符串输出
- 强大的路径解析功能（支持点语法和方括号索引）
- 两种解析模式：安全的手动解析器和不安全的 eval 解析器
- 严格的类型检查和边界约束

## 辅助函数

### `gettype = Object.prototype.toString`
用于获取对象的内部类型标识符，如 `[object Array]`。

### `changeToFloat(val)`
将输入值转换为浮点数表示：
- 如果值包含小数点，直接返回数字
- 如果是整数，返回带一位小数的字符串表示

**参数**：
- `val`：要转换的值

**返回**：数字或字符串形式的浮点数

### `highlightCode(text, type)`
为文本生成带颜色样式的 HTML 片段：

**参数**：
- `text`：要着色的文本
- `type`：类型标识符（"key"、"str"、"num"、"bool"、"unit"）

**返回**：HTML span 元素字符串

### `arrangementNbt(str)`
预处理 NBT 字符串，将带单位的数字转换为 NbtNumber 实例（用于 `decodeNbtStr`）。

### `decodeNbtStr(str)`（已弃用）
⚠️ 使用 `eval` 解析 NBT 字符串（存在安全风险，建议使用 `parseNbtString` 替代）。

### `changeObj(jsObj)`
将普通 JavaScript 对象转换为 NBT 对象树。

### `parsePath(path)`
解析点语法和方括号索引组成的路径为路径数组：
- 支持带引号的字符串键
- 支持数字索引
- 支持混合路径（如 `player.inventory[0].id`）

**参数**：
- `path`：路径字符串

**返回**：路径数组（字符串和数字组成）

## NBT 类型类

### `NbtObject`
表示 NBT 复合标签（键值对集合）。

**方法**：
- `addChild(key, value)`：添加子元素
- `isempty()`：检查对象是否为空
- `get(...path)`：按路径获取值（支持多级路径）
- `set(path, value)`：按路径设置值
- `text(ispretty)`：序列化为字符串（可选语法高亮）

### `NbtList`
表示 NBT 列表（有序集合）。

**方法**：
- `addChild(value)`：添加元素
- `isempty()`：检查列表是否为空
- `get(...path)`：按索引获取值（支持多级路径）
- `set(path, value)`：按索引设置值
- `text(ispretty)`：序列化为字符串（可选语法高亮）

### `NbtIntArray`
表示 NBT 整数数组（仅允许整数）。

**方法**：
- `addChild(value)`：添加整数元素（必须为无单位的 NbtNumber）
- `isempty()`：检查数组是否为空
- `get(index)`：按索引获取值（仅支持单级索引）
- `set(index, value)`：按索引设置值（仅支持单级索引）
- `text(ispretty)`：序列化为整数数组格式（如 `[I; 1, 2, 3]`）

### `NbtNumber`
表示 NBT 数值类型（支持单位后缀）。

**构造**：`new NbtNumber(value, unit="")`
- `unit`：单位类型（"b"=字节, "s"=短整型, "d"=双精度, "f"=单精度, ""=整型）

**方法**：
- `text(ispretty)`：序列化为字符串（带单位后缀）

### `NbtString`
表示 NBT 字符串类型。

**方法**：
- `text(ispretty)`：序列化为带引号的字符串（自动转义特殊字符）

### `NbtBool`
表示布尔值类型。

**方法**：
- `text(ispretty)`：序列化为 "true" 或 "false"

### `NbtNull`
表示空值类型。

**方法**：
- `text(ispretty)`：序列化为 "null"

## 核心解析器

### `parseNbtString(str)`
安全解析 NBT 字符串为 NBT 对象树（推荐使用）。

**功能**：
- 完整支持 NBT 语法（复合标签、列表、数组、基本类型）
- 支持带引号的字符串（含转义序列）
- 支持带单位的数字
- 支持尾随逗号
- 精确的错误位置报告

**参数**：
- `str`：NBT 格式字符串

**返回**：NBT 对象树的根节点

**错误处理**：解析失败时抛出带位置和上下文信息的错误

## 使用示例

```javascript
// 创建 NBT 对象
const playerData = new NbtObject({
    health: new NbtNumber(20, "f"),
    inventory: new NbtList([
        new NbtObject({
            id: new NbtString("minecraft:diamond_sword"),
            count: new NbtNumber(1)
        })
    ])
});

// 序列化为字符串（带高亮）
console.log(playerData.text(true));

// 使用路径获取值
console.log(playerData.get("inventory", 0, "id").value); 

// 解析 NBT 字符串
const parsed = parseNbtString(`{
    name: "Steve",
    position: [I; 100, 64, -200],
    isAlive: true
}`);
```

## 注意事项
1. 优先使用 `parseNbtString` 替代已弃用的 `decodeNbtStr`
2. 修改 NbtIntArray 时需确保值为整数
3. 路径解析区分字符串键和数字索引
4. 高亮输出需在支持 HTML 的环境中使用

该库提供了完整且安全的 NBT 数据处理能力，适用于 Minecraft 相关工具开发、数据转换和可视化等场景。
