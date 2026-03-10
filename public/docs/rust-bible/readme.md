# Rust 语言基础学习

> **版权声明**
> 本内容来自 [Rust 语言圣经](https://course.rs)
> 作者：sunface
> GitHub: https://github.com/sunface/rust-course
> 仅用于个人学习和参考

---

## 📖 学习路径

### 🔧 第一部分：寻找牛刀，以便小试 (first-try)

快速入门，搭建 Rust 开发环境：

- [安装 Rust 环境](first-try/installation.md)
- [墙推 VSCode!](first-try/editor.md)
- [认识 Cargo](first-try/cargo.md)
- [不仅仅是 Hello world](first-try/hello-world.md)
- [下载依赖太慢了？](first-try/slowly-downloading.md)

### 📚 第二部分：Rust 基础入门 (basic)

系统学习 Rust 核心概念：

#### 基础概念
- [变量绑定与解构](basic/variable.md)
- [基本类型](basic/base-type/index.md)
  - [数值类型](basic/base-type/numbers.md)
  - [字符、布尔、单元类型](basic/base-type/char-bool.md)
  - [语句与表达式](basic/base-type/statement-expression.md)
  - [函数](basic/base-type/function.md)

#### 所有权系统
- [所有权和借用](basic/ownership/index.md)
  - [所有权](basic/ownership/ownership.md)
  - [引用与借用](basic/ownership/borrowing.md)

#### 复合类型
- [复合类型](basic/compound-type/intro.md)
  - [字符串与切片](basic/compound-type/string-slice.md)
  - [元组](basic/compound-type/tuple.md)
  - [结构体](basic/compound-type/struct.md)
  - [枚举](basic/compound-type/enum.md)
  - [数组](basic/compound-type/array.md)

#### 控制流和模式匹配
- [流程控制](basic/flow-control.md)
- [模式匹配](basic/match-pattern/intro.md)
  - [match 和 if let](basic/match-pattern/match-if-let.md)
  - [解构 Option](basic/match-pattern/option.md)
  - [模式适用场景](basic/match-pattern/pattern-match.md)
  - [全模式列表](basic/match-pattern/all-patterns.md)

#### 进阶特性
- [方法 Method](basic/method.md)
- [泛型和特征](basic/trait/intro.md)
  - [泛型 Generics](basic/trait/generic.md)
  - [特征 Trait](basic/trait/trait.md)
  - [特征对象](basic/trait/trait-object.md)
  - [进一步深入特征](basic/trait/advance-trait.md)

#### 集合和生命周期
- [集合类型](basic/collections/intro.md)
  - [动态数组 Vector](basic/collections/vector.md)
  - [KV 存储 HashMap](basic/collections/hashmap.md)
- [认识生命周期](basic/lifetime.md)

#### 错误处理
- [返回值和错误处理](basic/result-error/intro.md)
  - [panic! 深入剖析](basic/result-error/panic.md)
  - [返回值 Result 和?](basic/result-error/result.md)

#### 模块系统
- [包和模块](basic/crate-module/intro.md)
  - [包 Crate](basic/crate-module/crate.md)
  - [模块 Module](basic/crate-module/module.md)
  - [使用 use 引入模块及受限可见性](basic/crate-module/use.md)

#### 工具和输出
- [注释和文档](basic/comment.md)
- [格式化输出](basic/formatted-output.md)

### 💻 第三部分：入门实战 (basic-practice)

通过实战项目巩固所学知识：

- [基本功能](basic-practice/base-features.md)
- [增加模块化和错误处理](basic-practice/refactoring.md)
- [测试驱动开发](basic-practice/tests.md)
- [使用环境变量](basic-practice/envs.md)
- [重定向错误信息的输出](basic-practice/stderr.md)
- [使用迭代器来改进程序(可选)](basic-practice/iterators.md)

---

## 🔗 相关资源

- **在线阅读**: https://course.rs
- **GitHub**: https://github.com/sunface/rust-course
- **配套练习**: https://github.com/sunface/rust-by-practice

---

**感谢 Rust 语言圣经项目组的辛勤付出！** 🙏
