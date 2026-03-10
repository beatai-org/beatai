# Rust语言圣经 - 完整内容迁移计划

> 作者：Sunface
> 创建日期：2026-03-10
> 状态：规划中

## 📋 迁移概览

将 rust-course 的完整内容按照正确顺序迁移到 LoongBot 文档系统。

### 当前状态
✅ 已完成（v0.3.0）:
- 第一部分：寻找牛刀（5 章）
- 第二部分：Rust 基础入门（17 章）
- 第三部分：入门实战（6 章）

### 待迁移内容
- ⬜ Rust 高级进阶（~30 章）
- ⬜ 进阶实战（~25 章）
- ⬜ 难点攻关（~6 章）
- ⬜ 常用工具链（~20 章）
- ⬜ 开发实践（~40 章）
- ⬜ 攻克编译错误（~15 章）
- ⬜ 性能优化（~15 章）
- ⬜ 附录（~30 章）

**总计待迁移**: ~180 章

---

## 📚 详细章节列表

### 第四部分：Rust 高级进阶

#### 4.1 生命周期进阶
- [ ] advance/lifetime/intro.md - 生命周期概述
- [ ] advance/lifetime/advance.md - 深入生命周期
- [ ] advance/lifetime/static.md - &'static 和 T: 'static

#### 4.2 函数式编程
- [ ] advance/functional-programing/intro.md - 函数式编程概述
- [ ] advance/functional-programing/closure.md - 闭包 Closure
- [ ] advance/functional-programing/iterator.md - 迭代器 Iterator

#### 4.3 深入类型
- [ ] advance/into-types/intro.md - 类型概述
- [ ] advance/into-types/converse.md - 类型转换
- [ ] advance/into-types/custom-type.md - newtype 和类型别名
- [ ] advance/into-types/sized.md - Sized 和不定长类型 DST
- [ ] advance/into-types/enum-int.md - 枚举和整数

#### 4.4 智能指针
- [ ] advance/smart-pointer/intro.md - 智能指针概述
- [ ] advance/smart-pointer/box.md - Box<T> 堆对象分配
- [ ] advance/smart-pointer/deref.md - Deref 解引用
- [ ] advance/smart-pointer/drop.md - Drop 释放资源
- [ ] advance/smart-pointer/rc-arc.md - Rc 与 Arc
- [ ] advance/smart-pointer/cell-refcell.md - Cell 与 RefCell

#### 4.5 循环引用与自引用
- [ ] advance/circle-self-ref/intro.md - 概述
- [ ] advance/circle-self-ref/circle-reference.md - Weak 与循环引用
- [ ] advance/circle-self-ref/self-referential.md - 结构体中的自引用

#### 4.6 多线程并发编程
- [ ] advance/concurrency-with-threads/intro.md - 并发编程概述
- [ ] advance/concurrency-with-threads/concurrency-parallelism.md - 并发和并行
- [ ] advance/concurrency-with-threads/thread.md - 使用多线程
- [ ] advance/concurrency-with-threads/message-passing.md - 消息传递
- [ ] advance/concurrency-with-threads/sync1.md - 锁、Condvar 和信号量
- [ ] advance/concurrency-with-threads/sync2.md - Atomic 原子操作
- [ ] advance/concurrency-with-threads/send-sync.md - Send 和 Sync

#### 4.7 其他高级主题
- [ ] advance/global-variable.md - 全局变量
- [ ] advance/errors.md - 错误处理
- [ ] advance/unsafe/intro.md - Unsafe Rust 概述
- [ ] advance/unsafe/superpowers.md - 五种兵器
- [ ] advance/unsafe/inline-asm.md - 内联汇编
- [ ] advance/macro.md - Macro 宏编程

#### 4.8 async/await 异步编程
- [ ] advance/async/intro.md - 异步编程概述
- [ ] advance/async/getting-started.md - async 编程入门
- [ ] advance/async/future-excuting.md - Future 执行与任务调度
- [ ] advance/async/pin-unpin.md - Pin 和 Unpin
- [ ] advance/async/async-await.md - async/await 和 Stream
- [ ] advance/async/multi-futures-simultaneous.md - 同时运行多个 Future
- [ ] advance/async/pain-points-and-workarounds.md - 疑难问题解决
- [ ] advance/async/web-server.md - Async Web 服务器

### 第五部分：进阶实战

#### 5.1 实现一个 Web 服务器
- [ ] advance-practice1/intro.md - Web 服务器概述
- [ ] advance-practice1/web-server.md - 单线程版本
- [ ] advance-practice1/multi-threads.md - 多线程版本
- [ ] advance-practice1/graceful-shutdown.md - 优雅关闭

#### 5.2 实现一个简单 Redis
- [ ] advance-practice/intro.md - Redis 实现概述
- [ ] advance-practice/overview.md - tokio 概览
- [ ] advance-practice/getting-startted.md - 使用初印象
- [ ] advance-practice/spawning.md - 创建异步任务
- [ ] advance-practice/shared-state.md - 共享状态
- [ ] advance-practice/channels.md - 消息传递
- [ ] advance-practice/io.md - I/O
- [ ] advance-practice/frame.md - 解析数据帧
- [ ] advance-practice/async.md - 深入 async
- [ ] advance-practice/select.md - select
- [ ] advance-practice/stream.md - Stream
- [ ] advance-practice/graceful-shutdown.md - 优雅的关闭
- [ ] advance-practice/bridging-with-sync.md - 异步跟同步共存

### 第六部分：Rust 难点攻关

- [ ] difficulties/intro.md - 难点概述
- [ ] difficulties/slice.md - 切片和切片引用
- [ ] difficulties/eq.md - Eq 和 PartialEq

### 第七部分：常用工具链

#### 7.1 自动化测试
- [ ] test/intro.md - 测试概述
- [ ] test/write-tests.md - 编写测试及控制执行
- [ ] test/unit-integration-test.md - 单元测试和集成测试
- [ ] test/assertion.md - 断言 assertion
- [ ] test/ci.md - GitHub Actions 持续集成
- [ ] test/benchmark.md - 基准测试

#### 7.2 Cargo 使用指南
**基础指南**
- [ ] cargo/intro.md - Cargo 概述
- [ ] cargo/getting-started.md - 上手使用
- [ ] cargo/guide/intro.md - 基础指南概述
- [ ] cargo/guide/why-exist.md - 为何会有 Cargo
- [ ] cargo/guide/download-package.md - 下载并构建 Package
- [ ] cargo/guide/dependencies.md - 添加依赖
- [ ] cargo/guide/package-layout.md - Package 目录结构
- [ ] cargo/guide/cargo-toml-lock.md - Cargo.toml vs Cargo.lock
- [ ] cargo/guide/tests-ci.md - 测试和 CI
- [ ] cargo/guide/cargo-cache.md - Cargo 缓存
- [ ] cargo/guide/build-cache.md - Build 缓存

**进阶指南**
- [ ] cargo/reference/intro.md - 进阶指南概述
- [ ] cargo/reference/specify-deps.md - 指定依赖项
- [ ] cargo/reference/deps-overriding.md - 依赖覆盖
- [ ] cargo/reference/manifest.md - Cargo.toml 清单详解
- [ ] cargo/reference/cargo-target.md - Cargo Target
- [ ] cargo/reference/workspaces.md - 工作空间 Workspace
- [ ] cargo/reference/features/intro.md - 条件编译 Features
- [ ] cargo/reference/features/examples.md - Features 示例
- [ ] cargo/reference/profiles.md - 发布配置 Profile
- [ ] cargo/reference/configuration.md - config.toml 配置
- [ ] cargo/reference/publishing-on-crates.io.md - 发布到 crates.io
- [ ] cargo/reference/build-script/intro.md - 构建脚本 build.rs
- [ ] cargo/reference/build-script/examples.md - 构建脚本示例

### 第八部分：开发实践

#### 8.1 企业落地实践
- [ ] usecases/intro.md - 实践概述
- [ ] usecases/aws-rust.md - AWS 为何喜欢 Rust

#### 8.2 日志和监控
- [ ] logs/intro.md - 日志概述
- [ ] logs/about-log.md - 日志详解
- [ ] logs/log.md - 日志门面 log
- [ ] logs/tracing.md - 使用 tracing 记录日志
- [ ] logs/tracing-logger.md - 自定义 tracing 输出
- [ ] logs/observe/intro.md - 监控概述
- [ ] logs/observe/about-observe.md - 可观测性
- [ ] logs/observe/trace.md - 分布式追踪

#### 8.3 Rust 最佳实践
- [ ] practice/intro.md - 最佳实践概述
- [ ] practice/third-party-libs.md - 三方库精选
- [ ] practice/naming.md - 命名规范
- [ ] practice/interview.md - 面试经验

#### 8.4 手把手实现链表（~40 章）
- [ ] too-many-lists/intro.md - 链表实现概述
- [ ] too-many-lists/do-we-need-it.md - 是否需要链表
- [ ] 不太优秀的单向链表系列（4 章）
- [ ] 还可以的单向链表系列（4 章）
- [ ] 持久化单向链表系列（2 章）
- [ ] 不咋样的双端队列系列（5 章）
- [ ] 不错的 unsafe 队列系列（8 章）
- [ ] 生产级双向 unsafe 队列系列（11 章）
- [ ] 高级技巧实现链表系列（2 章）

### 第九部分：攻克编译错误

#### 9.1 对抗编译检查
- [ ] compiler/intro.md - 编译错误概述
- [ ] compiler/fight-with-compiler/intro.md - 对抗编译检查概述
- [ ] 生命周期问题系列（4 章）
- [ ] 重复借用问题系列（2 章）

#### 9.2 Rust 常见陷阱
- [ ] compiler/pitfalls/index.md - 常见陷阱概述
- [ ] compiler/pitfalls/use-vec-in-for.md - for 循环中使用外部数组
- [ ] compiler/pitfalls/stack-overflow.md - 线程类型导致的栈溢出
- [ ] compiler/pitfalls/arithmetic-overflow.md - 算术溢出
- [ ] compiler/pitfalls/closure-with-lifetime.md - 闭包中的生命周期
- [ ] compiler/pitfalls/the-disabled-mutability.md - 可变变量不可变
- [ ] compiler/pitfalls/multiple-mutable-references.md - 可变借用失败
- [ ] compiler/pitfalls/lazy-iterators.md - 不勤快的迭代器
- [ ] compiler/pitfalls/weird-ranges.md - 奇怪的序列
- [ ] compiler/pitfalls/iterator-everywhere.md - 无处不在的迭代器
- [ ] compiler/pitfalls/main-with-channel-blocked.md - 主线程无法结束
- [ ] compiler/pitfalls/utf8-performance.md - UTF-8 性能隐患

### 第十部分：性能优化

#### 10.1 性能调优
- [ ] profiling/intro.md - 性能优化概述
- [ ] profiling/performance/intro.md - 性能调优概述
- [ ] profiling/performance/string.md - 字符串操作性能
- [ ] profiling/performance/deep-into-move.md - 深入理解 move

### 第十一部分：附录

- [ ] appendix/keywords.md - 关键字
- [ ] appendix/operators.md - 运算符与符号
- [ ] appendix/expressions.md - 表达式
- [ ] appendix/derive.md - 派生特征 trait
- [ ] appendix/rust-version.md - Rust 版本说明
- [ ] appendix/rust-versions/intro.md - 版本更新解读
- [ ] appendix/rust-versions/*.md - 各版本详细更新（~30 章）

---

## 🔄 迁移策略

### 阶段一：核心进阶内容（优先级：高）
**预计文件数**: ~50 章

1. **第四部分：Rust 高级进阶**
   - 生命周期进阶
   - 函数式编程
   - 智能指针
   - 多线程并发
   - async/await 异步编程

2. **第五部分：进阶实战**
   - Web 服务器实现
   - Redis 实现

### 阶段二：工具链和实践（优先级：中）
**预计文件数**: ~60 章

3. **第七部分：常用工具链**
   - 自动化测试
   - Cargo 完整指南

4. **第八部分：开发实践**
   - 企业落地
   - 日志和监控
   - 最佳实践

### 阶段三：难点和优化（优先级：中）
**预计文件数**: ~30 章

5. **第六部分：难点攻关**
6. **第九部分：攻克编译错误**
7. **第十部分：性能优化**

### 阶段四：链表和附录（优先级：低）
**预计文件数**: ~70 章

8. **链表系列**（40+ 章）
9. **第十一部分：附录**（30+ 章）

---

## 📝 _meta.json 更新计划

需要在 `public/docs/_meta.json` 的 `rust-bible` 类别中添加新的 sections：

```json
{
  "id": "rust-bible",
  "title": "Rust语言圣经",
  "sections": [
    // 已有的 3 个部分...
    {
      "title": "🚀 第四部分：Rust 高级进阶",
      "path": "/docs/rust-bible/advance-intro",
      "items": [...]
    },
    {
      "title": "⚡ 第五部分：进阶实战",
      "path": "/docs/rust-bible/advance-practice-intro",
      "items": [...]
    },
    // ... 其他部分
  ]
}
```

---

## ✅ 执行清单

### 准备工作
- [x] 克隆 rust-course 仓库
- [x] 分析完整目录结构
- [x] 创建迁移计划文档
- [ ] 确认版权和授权（已确认：Sunface 本人）

### 阶段一执行（高级进阶 + 进阶实战）
- [ ] 复制 advance/ 目录所有文件
- [ ] 复制 advance-practice/ 和 advance-practice1/ 目录
- [ ] 更新图片路径
- [ ] 更新内部链接
- [ ] 更新 _meta.json 配置
- [ ] 测试所有链接和导航

### 后续阶段
- [ ] 按照优先级依次执行
- [ ] 每个阶段完成后提交代码
- [ ] 创建对应的版本标签

---

## 📊 工作量估算

| 阶段 | 章节数 | 预计工时 | 优先级 |
|------|--------|---------|--------|
| 阶段一 | ~50 章 | 4-6 小时 | 高 |
| 阶段二 | ~60 章 | 5-7 小时 | 中 |
| 阶段三 | ~30 章 | 3-4 小时 | 中 |
| 阶段四 | ~70 章 | 6-8 小时 | 低 |
| **总计** | **~210 章** | **18-25 小时** | - |

---

## 🎯 版本规划

- **v0.4.0**: 阶段一（高级进阶 + 进阶实战）
- **v0.5.0**: 阶段二（工具链 + 开发实践）
- **v0.6.0**: 阶段三（难点攻关 + 性能优化）
- **v1.0.0**: 阶段四（链表 + 附录）- 完整版

---

## 📞 注意事项

1. **图片路径处理**
   - 需要复制 `src/img/` 目录
   - 更新 Markdown 中的图片引用路径

2. **内部链接更新**
   - 将相对路径转换为绝对路径
   - 格式：`/docs/rust-bible/xxx`

3. **代码示例**
   - 确保代码高亮正确
   - 测试 Playground 集成

4. **版权声明**
   - 在每个文档开头添加原作者信息
   - 保留 Sunface 的版权声明

---

**创建者**: Claude Opus 4.6
**审核者**: Sunface
**状态**: 等待确认执行
