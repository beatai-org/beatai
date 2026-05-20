---
title: DeepSeek-V4 及其之前 —— 把基础打牢
author: James Koh, PhD
url: https://medium.com/mitb-for-all/deepseek-v4-and-before-getting-the-foundations-right-d45ae9a07724
translated: 2026-05-20
tags:
  - LLM
summary: 2025 年 1 月 Deepseek-R1 的发布，伴随着开放发布的蒸馏版「32B 与 70B 模型，性能与 OpenAI-o1-mini 相当」，在随后的一周里引发了大型 AI 公司股价的暴跌。
cover: ./images/deepseek-v4-and-before-getting-the-foundations-right/01.thumb.webp
---

# DeepSeek-V4 及其之前 —— 把基础打牢

## 理解驱动它的那些组件

这篇文章是为我 2026 年 4 月学期 CS610 课程的学生而写的。

## 目录

-   背景
-   为什么是 DeepSeek？
-   参考文献
-   1\. 你不应该跳过的基础知识
-   1.1 字节对编码 (Byte Pair Encoding)  
    1.2 嵌入 (Embeddings)  
    1.3 考虑上下文  
    1.4 位置编码 (Positional Encodings)  
    1.5 获取输出
-   2\. 构建模块
-   2.1 注意力机制 (Attention)  
    2.2 多头潜在注意力 (Multi-heads Latent Attention, MLA)  
    2.3 专家混合 (Mixture-of-Experts, MoE)  
    2.4 多 Token 预测 (Multi-Token Prediction, MTP)
-   3\. DeepSeek-v4 中的新东西
-   3.1 流形约束超连接 (Manifold-Constrained Hyper-Connections, mHC)  
    3.2 压缩稀疏注意力 (Compressed Sparse Attention, CSA)  
    3.3 重度压缩注意力 (Heavily Compressed Attention, HCA)  
    3.4 Muon 优化器

## 背景

2025 年 1 月 Deepseek-R1 的发布，伴随着开放发布的蒸馏版“[32B 与 70B 模型，性能与 OpenAI-o1-mini 相当](https://api-docs.deepseek.com/news/news250120)”，在随后的一周里引发了大型 AI 公司[股价的暴跌](https://www.reuters.com/technology/artificial-intelligence/chinas-deepseek-sparks-ai-market-rout-2025-01-27)。几周之内，我便立即更新了 CS610 的课程内容，向 Jan'25 和 Apr'25 两届学生讲授如何[在本地部署 Deepseek](https://medium.com/mitb-for-all/deploying-deepseek-locally-c96ce6a74634)。

今年，在我为 Apr'26 学期准备 CS610 课程时，Deepseek 于 2026 年 4 月[发布了它的 V4](https://api-docs.deepseek.com/news/news260424)，展现出与 Claude-Opus-4.6、GPT-5.4 和 Gemini-3.1 相当的性能。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/01.webp)
*图片来源：https://api-docs.deepseek.com/news/news260424*

对底层发生的事情有良好的技术理解是件好事。能够在实习/求职面试中准确地谈论这些内容，无疑会让你领先一步。

幸运的是（或者对那些基础薄弱的人来说是不幸的），每一次新发布都建立在大量基础知识之上，这意味着对于刚入门的人来说，仅仅阅读最新的论文远远不够，而追着一篇又一篇引用文献去读，则会把你带进一个无底洞。更别提 V3 和 V4 的论文加在一起总共超过 100 页这一事实了。

## 为什么是 DeepSeek？

我之所以选择聚焦于 Deepseek 系列，是因为它们配套的论文对模型架构以及训练过程提供了深入的细节，这一点与其他闭源替代方案不同。

v3、r1 和 v4 之间有许多重叠之处，比如多头潜在注意力 (Multi-Head Latent Attention) 和专家混合 (Mixture-of-Experts)。它们也都实现了组相对策略优化 (Group Relative Policy Optimization, GRPO)，我会在我的强化学习课程中讲解它。

让我们一步一步地构建。我敢打赌，即使在 5 年之后，这些知识作为一个基础构建模块仍然会保持其相关性。

## 参考文献

为了完整起见，并提供一个带时间线概览的快速入口，这里列出了 DeepSeek 及其他机构的相关论文。

**由 DeepSeek 发布**

-   DeepSeek-MoE，Dai *et al*. (2024) *Towards Ultimate Expert Specialization in Mixture-of-Experts Language Models*。[https://arxiv.org/pdf/2401.06066](https://arxiv.org/pdf/2401.06066)
-   DeepSeek-v3，Liu *et al*. (2024) *DeepSeek-V3 Technical Report*。[https://arxiv.org/abs/2412.19437](https://arxiv.org/abs/2412.19437)
-   DeepSeek-r1，Guo *et al*. (2025) *DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning*。[https://arxiv.org/pdf/2501.12948](https://arxiv.org/pdf/2501.12948)
-   DeepSeek-v4，Deepseek (2026) *DeekSeek-V4: Towards Highly Efficient Million-Token Context Intelligence*。[https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro/blob/main/DeepSeek\_V4.pdf](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro/blob/main/DeepSeek_V4.pdf)

**其他**

-   Attention Is All You Need，Vaswani *et al*. (2017) [https://arxiv.org/abs/1706.03762](https://arxiv.org/abs/1706.03762)
-   GPT-2，Radford *et al*. (2019) *Language Models are Unsupervised Multitask Learners.* [https://cdn.openai.com/better-language-models/language\_models\_are\_unsupervised\_multitask\_learners.pdf](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
-   GPT-3，Brown *et al*. (2020) *Language Models are Few-Shot Learners*。[https://arxiv.org/abs/2005.14165](https://arxiv.org/abs/2005.14165)
-   GPT-4，Achiam *et al*. (2023) *GPT-4 Technical Report*。[https://arxiv.org/pdf/2303.08774](https://arxiv.org/pdf/2303.08774)
-   RoFormer，Su *et al*. (2021/2024) [https://arxiv.org/abs/2104.09864v5](https://arxiv.org/abs/2104.09864v5)；[https://doi.org/10.1016/j.neucom.2023.127063](https://doi.org/10.1016/j.neucom.2023.127063)
-   Multi-token Prediction，Gloeckle *et al*. (2024) [https://arxiv.org/pdf/2404.19737](https://arxiv.org/pdf/2404.19737)

## 1\. 你不应该跳过的基础知识

我一直坚信要理解输入是如何被转换为模型输出的。让我们从头开始。

DeepSeek，或者就此而言任何 LLM，接收的都是一个字符串（即字符序列）。

### 1.1 字节对编码 (Byte Pair Encoding)

从输入序列出发，我们首先需要确定 token，之后才有可能映射到对应的向量。

字节对编码 (Byte Pair Encoding, BPE) 是一种子词级别的分词方法。它是介于对单个字符进行分词（单个字符本身并不传达太多含义）与不加区分地取整个单词（这会损失泛化能力）之间的一个折中方案。

尽管它可以追溯到 1990 年代（Shibata et al. 1999），但它在 2020 年代的最先进模型中仍被使用，无论是 GPT 还是 DeepSeek。  
BPE 的工作方式是迭代地合并最频繁出现的相邻符号对（这些符号一开始是单个字符）。常用词通常最终就会变成单个 token。DeepSeek-v3 的分词器拥有 128,000 个 token 的词表（见 DeepSeek-v3 的 4.1 节）。

为了说明这一点，考虑句子‘*My father works in a financial corporation.*’

```python
import torch
from transformers import AutoTokenizer, AutoModeltokenizer = AutoTokenizer.from_pretrained(
    "deepseek-ai/deepseek-llm-7b-base"
)
sentence = "My father works in a financial corporation."tokens = tokenizer.tokenize(sentence, return_tensors="pt")
token_ids = tokenizer(sentence)["input_ids"]
print("Tokens:", tokens)  
print("Token IDs:", token_ids)
```

它会变成下面这八个 token。注意，单词‘in’和‘a’各自用一个 token 表示（索引 1695），而‘corporation’则用两个 token 表示。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/02.webp)

这些 token 索引反过来又可以用来取回原始的子词。

```
for idx in token_ids:
    print(tokenizer.decode(idx))
```

### 1.2 嵌入 (Embeddings)

从 BPE 得到 token 之后，我们需要用数学方式来表示它。一个嵌入可以宽松地理解为对一个 token 的描述/表示 —— 例如它是动词还是名词、语义属性、它所承载的含义色彩、典型的关联等等。这些值全都是学出来的（基于它们在大型语料库中的自然出现情况），甚至可能无法被逐个解释。它类似于一张图像的[特征向量](https://medium.com/mitb-for-all/intuition-behind-probabilities-from-supervised-learning-391a4eaf2ac6)。

对于嵌入 vᵢ 最初是如何获得的，存在许多经典方法，例如使用 Word2Vec、GloVe，或者像 FAIR 的 FastText 这样更花哨的方法。

我们可以通过把一个 torch 张量传入 `.embed_tokens` 来获取嵌入。其输出是一个形状为 \[1, n\_tokens, 4096\] 的 torch.Tensor，其中 4096 对应于嵌入空间的维度数。

```sql
model = AutoModel.from_pretrained(
    "deepseek-ai/deepseek-llm-7b-base", output_hidden_states=True
)
model.eval()token_ids = tokenizer(sentence, return_tensors="pt")["input_ids"]  
with torch.no_grad():
    token_embeddings = model.embed_tokens(token_ids)
```

我在这里使用的是一个简单的蒸馏版‘7B’变体，而不是使用最新的 Deepseek-V4，这样任何读者都可以快速、轻松地复现。其概念完全相同。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/03.webp)
*作者截图，展示了来自“deepseek-ai/deepseek-llm-7b-base”的模型构成。*

为了对事情有更好的体感，让我们把每个 token 与其嵌入的前四个值一起可视化（当然，我们可以使用 PCA 或某种降维技术，但还是让事情保持简单吧）。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/04.webp)

注意这些值大多在 0.01 ~ 0.1 这个数量级。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/05.webp)
*每个 token 的前四个嵌入值。*

现在，如果我们在没有上下文的情况下比较‘works’和‘corpor’的 token 嵌入（维度为 4096）之间的余弦相似度，结果仅仅是 0.04。这是因为原始的 token 嵌入本身并不捕捉任何句子语义。这里没有上下文，甚至连它们在句子中相对位置的知识都没有。

```
emb_1 = token_embeddings[:,2,:]  
emb_2 = token_embeddings[:,5,:]  from torch.nn.functional import cosine_similarity
cosine_similarity(emb_1, emb_2)
```

提前剧透一下，如果你去比较最后一个隐藏状态的嵌入，余弦相似度会上升到 0.707。我们将继续往下看，了解这是如何成为可能的。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/06.webp)
*作者截图。*

### 1.3 考虑上下文

接下来，考虑短语“*father works at a bank*”。每个单词/token 都有它们自己的向量。然而，*bank* 可能有多种含义（金融机构、河岸等），而其上下文取决于句子中的其他单词。因此，我们想要一个经过修改的向量，它不仅是特定于单词的，还包含来自其邻居的上下文。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/07.webp)
*关于嵌入向量 v1 到 v5 如何被修改为 y1 到 y5 的想法。我们想要把 v2（‘works’）的某些方面与 v5（‘bank’）结合起来，使得所得到的 y5 捕捉到 bank 指代某个金融机构的信息。图片由作者绘制。*

不存在任何把 vᵢ 变换为 yᵢ 的‘单一最佳选择’ **W**，因为它取决于其他 token。因此，乘以一个可学习的矩阵显然是有益的，使得所得到的 yᵢ 能够考虑上下文。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/08.webp)
*在把 vᵢ 变换为 yᵢ 时考虑整体的句子上下文，而不是试图使用一刀切的权重。图片由作者绘制。*

注意，即使是相同的单词，qᵢ、kᵢ 和 vᵢ 也会不同，因为它们会使用不同的投影矩阵进行映射（上图中未展示）：

![](./images/deepseek-v4-and-before-getting-the-foundations-right/09.webp)
*Q、K、V 是所有 token（可以想成单词）的查询、键和值表示，它们是通过用学到的矩阵 WQ、WK 和 WV 投影输入嵌入 X 而得到的。*

对于那些对线性代数不太清楚的人，下面的内容会有帮助。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/10.webp)
*假设每个 x 是一个长度为 100 的向量，而 v 是一个长度为 200 的向量。矩阵 X 由 x1 到 x5 组成（假设有 5 个 token）。V = XW_{V} 的形状为 (N, 200) = (N, 100) x (100, 200)。在实际中，W_{V} 通常是方阵，因为维度是相同的；不过我在这里用了不同的维度来强调其中的数学。注意，这里的 W_{V} 与本节开头的 W11 到 W55 非常不同；那些 W11 到 W55 它们本身可以是 Q 和 K 的函数。*

### **1.4** 位置编码 (Positional Encodings)

注意力块并不区分 token 的顺序。然而，位置是重要的，理应被纳入考虑（‘*not completely*’和‘*completely not*’有着不同的含义）。

我们将从正弦位置编码 (Sinusoidal Positional Encodings) 开始。在那之后，基于这一知识来理解旋转位置编码 (Rotary Positional Encodings) 就很容易了。在 Vaswani *et al*. (2017) 的[注意力论文](https://arxiv.org/pdf/1706.03762)中，给出了以下内容：

![](./images/deepseek-v4-and-before-getting-the-foundations-right/11.webp)
*‘Attention Is All You Need’论文 3.5 节中的公式。*

每个 token 位置 `pos` 都被赋予一个长度为 d\_{model} 的确定性向量。索引 `i` 指的是嵌入向量内部的维度，而不是某个 token 在句子中的位置。对于一个 4096 维的空间，我们有 2048 对 (`2i, 2i+1`)。

下面的 gif 展示了位置嵌入 (PE) 的正弦分量如何随 token 位置 `pos` 变化。每一帧快照代表位置嵌入的 2048 个值，对应于某个特定的 `pos`；当把它加到另外的 2048 个余弦值上时，我们看到每个 4096 维的 `pos` 都有它自己独特的‘签名’。

这个 PE 向量会被加（叠加）到 token 嵌入上，导致信息被‘混合’，但把位置嵌入拼接上去并不可取，因为这会带来更多的参数和训练开销。为了说明叠加的效果，我把两张我自己拍的照片叠加在了一起（一张是一盘食物，另一张是一个地方）。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/12.webp)
*作者绘制的叠加图像。想象食物图片中的像素对应于 token 嵌入，而地点图片中的像素对应于位置嵌入。*

位置信息可以以一种不那么‘侵入性’的方式被纳入，即通过旋转位置编码 (RoPE)。在这里，d 维的嵌入空间被划分为 d/2 个子空间，向量根据 token 位置 *m*（上文称为 `pos`）和 𝜃ᵢ（公式如下）所确定的角度进行旋转。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/13.webp)
*RoFormer https://arxiv.org/pdf/2104.09864 第 3.4.2 节中方程 34 的截图，它是其 3.2.2 节中方程 14 和 15 的一种高效形式。*

![](./images/deepseek-v4-and-before-getting-the-foundations-right/14.webp)
*角度 𝜃 是 i（嵌入向量内部的维度）和 d 的函数。公式来自 RoFormer 的 3.2.2 节。*

这一点通过使用 YaRN (Yet another RoPE extension) 进一步发展，用于处理更大的上下文，正如 2024 年 DeepSeek-V3 论文 4.3 节中所述，该节引用了一篇更早的 2023 年的工作。

### **1.5 获取输出**

当我们把一段文本输入传给一个 LLM 并收到一个回答时，我们实际上得到的是一连串 token 的预测，被拼接在一起。每个输出都被增量式地追加到输入序列上，然后从中预测出下一个输出 token。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/15.webp)
*在生成后续预测时，输出被追加为输入。由于我们正在建立基础知识，让我们暂时忽略诸如多 Token 预测这样的改进。*

看起来似乎会有大量重复的计算，但键值缓存 (key-value cache) 让模型能够复用之前计算好的 K 和 V 向量，因此在每个生成步骤，它只需要把最新的 token 通过 Transformer 层进行处理，同时对缓存的过去 token 进行注意力计算。

## 2\. 构建模块

在 DeepSeek-V3 中，作者声明有 61 个 Transformer 层，其中每一层（块）由 RMSNorm、多头潜在注意力（本文 2.2 节）、专家混合（本文 2.3 节）以及跳跃连接组成。你很可能已经知道 RMSNorm 和跳跃连接了。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/16.webp)
*Deepseek-v3 (2024) https://arxiv.org/pdf/2501.12948 图 2 的截图。DeepSeek-V3 的架构。*

### 2.1 注意力机制 (Attention)

在注意力机制出现之前，编码器-解码器序列模型不得不把输入压缩成一个固定大小的上下文向量，从而导致信息瓶颈，并因此损害性能，尤其是在处理大型上下文时。

注意，在本文的 1.3 节中，我们试图让 yᵢ 考虑上下文（尽管那个上下文非常短，只是为了说明）。这在注意力机制中是可以实现的。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/17.webp)
*‘Attention Is All You Need’ https://arxiv.org/pdf/1706.03762 图 2 的截图。我们将先聚焦于左侧（仅注意力部分），并在后面的小节中看多头注意力。*

你应该已经在许多地方见过上面这张图了。让我们确保我们知道这里的数学运算***为什么***以及***如何***被执行。

从数学上讲，上面左侧的图仅仅是在描述下面这个方程。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/18.webp)
*注意力论文 https://arxiv.org/pdf/1706.03762 第 3.2.1 节中的方程 (1)。*

展示中间步骤的流程图可能会让这个过程对你来说更清晰。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/19.webp)
*图片由作者绘制*

在自注意力 (self-attention) 中，同一个 X（如果我们在第一层，它可能是输入嵌入，或者是某个中间隐藏状态）被用来获得 Q、K 和 V，而在交叉注意力 (cross-attention) 中，Q 来自一个序列，而 K 和 V 来自另一个序列。

Deepseek 的各个变体，其架构是公开的并可以被验证，它们实际上是仅解码器 (decoder-only) 的 LLM，因此我们将聚焦于自注意力。注意力矩阵被因果掩码 (causally masked)，即每个 token 只能对它自己以及更早的 token 进行注意力计算，但不能对未来的 token。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/20.webp)
*对于 n 个 token，注意力矩阵的形状将是 (n, n)，其中注意力矩阵的每个分量 a_{i,j} 表示 token i 对 token j 的注意力程度有多大。*

### 2.2 多头潜在注意力 (Multi-heads Latent Attention, MLA)

我们接着来谈‘多头’注意力的原理。一个句子通常包含若干必须同时被解读的关系。想一个句子，比如“*My father works at a bank where overtime is discouraged*”。

单个注意力头已经可以让每个 token 对其他每个 token 进行注意力计算，但它只能捕捉一种模式。有了多头，一个头可能聚焦于像‘My’和‘father’这样的关系（而不是‘My’和‘bank’），另一个头可能把像‘works’和‘bank’这样的地点关联起来，而第三个头可能追踪像‘overtime’和‘discouraged’这样的情感。

当然，它不会那么直截了当、那么界限分明地被划分开来，我们就把它留给模型，让它在训练期间学会任何最有效的方式。

正如 DeepSeek-V3 论文 4.2 节中所述，注意力头的数量是 128，每个头的维度也是 128。

我们现在来看 MLA 中的‘潜在 (latent)’。

存储 KV（键值）缓存的想法是为了避免重复计算，正如上文 1.5 节中所提到的。然而，这又引起了另一个问题。如果我们存储所有东西，缓存就会非常大，对于长上下文来说这会变得昂贵。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/21.webp)
*Deepseek-v3 (2024) https://arxiv.org/pdf/2501.12948 第 2.1.1 节中方程 (1) 到 (5) 的截图，并由作者进一步修改，以便在单一视图中包含额外的信息。*

**h**ₜ 是 token t 在某个给定注意力层的隐藏表示。MLA 首先把 **h**ₜ 压缩成一个更小的潜在向量 **c**ₜᴷⱽ。DeepSeek-v3（4.2 节）中声明隐藏维度是 7168，而 KV 压缩维度是 512（即原始维度的 1/14）。因此，Wᴰᴷⱽ 是一个形状为 (512, 7168) 的可学习参数矩阵。

为了重建，被压缩的潜在向量 **c**ₜᴷⱽ 使用矩阵 Wᵁᴷ 进行上投影，以得到 **k**ₜᶜ，它是所有注意力头 1 到 nₕ 的内容键 (content-key) 分量的拼接。有 128 个注意力头且每个头的维度为 128（同样在 DeepSeek 论文 4.2 节中声明），Wᵁᴷ 将具有形状 (16384, 512)。

继续看上面截图的第 3 个方程，**k**ₜᴿ 是键的被压缩的旋转位置部分。（关于旋转位置编码 RoPE，请参阅我上面的 1.4 节。）DeepSeek-v3 的作者把架构设计成：**k**ₜᶜ 从被压缩的潜在向量 **c**ₜᴷⱽ 中重建，而 **k**ₜᴿ 则被单独确定，因为如果位置信息被直接混入其中，缓存就会不那么干净，因此更难以高效地表示 **c**ₜᴷⱽ。鉴于 DeepSeek 作者把 dₕᴿ 设为 64，矩阵 Wᴷᴿ 具有形状 (64, 7168)。

第 4 个方程对应于 DeepSeek 2.1.1 节中所说的“*携带旋转位置嵌入的解耦键 (decoupled key that that carries Rotary Positional Embedding)*”。与此同时，第 5 个方程展示了值 **v**ₜᶜ 是如何使用 Wᵁⱽ 重建的，与 **k**ₜᶜ 的情况类似。

注意力查询也经历了一次低秩压缩。它就像上面那样，只是用了不同的矩阵 Wᴰꟴ、Wᵁꟴ 和 Wꟴᴿ。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/22.webp)
*Deepseek-v3 (2024) https://arxiv.org/pdf/2501.12948 第 2.1.1 节中方程 (6) 到 (9) 的截图。*

### 2.3 专家混合 (Mixture-of-Experts, MoE)

DeepSeek-V3 论文中对其 MoE 如何工作几乎没有任何解释，除了这样一个事实：“*每个 MoE 层由 1 个共享专家和 256 个路由专家组成，……在路由专家当中，每个 token 会激活 8 个专家*”。

因此，对于 DeepSeek 所使用的 MoE 的具体细节，我们将参考 Dai *et al*. (2024)（因为自 20 世纪后期以来，MoE 已经以[许多形式](https://ieeexplore.ieee.org/abstract/document/6215056/)被使用过）。

MoE 的想法是让‘专门化的’网络组件在（路由器认为）它们擅长的领域做出预测。因此，可以训练一个大容量的模型，同时把每个 token 的计算量保持在可管理的范围内。DeepSeek-V3 由 671B 个总参数组成，其中每个 token 仅有约 5.5% 被激活。

DeepSeek 的 MoE 利用了细粒度专家分割 (Fine-Grained Expert Segmentation)（[https://arxiv.org/pdf/2401.06066](https://arxiv.org/pdf/2401.06066) 的 3.1 节），专家数量增加，每个专家的尺寸减小，以实现“*更灵活、更具适应性的已激活专家组合*”。这些专家由一个路由器选择。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/23.webp)
*Deepseek-MoE (2024) https://arxiv.org/pdf/2401.06066 图 2 的截图。在 (b) 中，我们看到路由器所考虑的专家数量是两倍，每个专家的尺寸都减小了（由更小的方框表示）。被选中的‘细粒度专家’的数量也是两倍。在 (c) 中，我们看到 #1 是一个‘共享专家’，它被直接使用，无需被路由器选择。*

为了避免冗余（即不同的专家学习共同的知识），DeepSeek 还隔离出若干专家来充当“*共享专家*”，正如上图 (c) 所示，它们将被“*确定性地分配*”，而不是依赖路由器来选择。

与此同时，他们也考虑了负载均衡（MoE 论文 3.3 节），因为如果路由具有一个有偏斜的分布，那些较少被选中的专家可能得不到充分的训练，从而表现糟糕，这又强化了它们被选中的低概率，并冒着路由崩溃 (routing collapse) 的风险，即它们变得冗余。

DeepSeek-v3 使用了一种无辅助损失的负载均衡策略 (auxiliary-loss-free load balancing strategy)（[https://arxiv.org/pdf/2412.19437](https://arxiv.org/pdf/2412.19437) 的 2.1.2 节），其中在决定 top-K 路由目标时，会加上一个偏置项（如果某个专家负载不足，该项就增加，反之则减小）。

### 2.4 多 Token 预测 (Multi-Token Prediction, MTP)

在多 Token 预测中，模型被训练为使用不同的输出头一次性预测多个未来的 token。正如 DeepSeek-v3 的作者所说，这“*使训练信号变得密集*”，并“*可能使模型能够预先规划其表示*”。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/24.webp)
*被 DeepSeek-v3 引用的 Gloeckle et al. (2024) 多 Token 预测论文 https://arxiv.org/pdf/2404.19737 图 1 的截图。*

从数学上讲，当要一次性预测 n 个未来 token 时，模型被训练为：在给定输入 token x₁, …, xₜ 的条件下，最小化所预测的未来 token x\_{t+1}, …, x\_{t+n} 的[负对数似然](https://medium.com/mitb-for-all/mle-vs-map-worked-example-1712e2fcb49b)（即交叉熵损失）。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/25.webp)
*多 Token 预测论文中方程 (2) 的截图。*

DeepSeek-v3 没有使用相互独立的头，而是顺序地预测未来的 token，以“*在每个预测深度上保持完整的因果链*”（DeepSeek-v3 论文 2.2 节）。作者还声明，MTP 被用来“*提升主模型的性能，因此在推理期间，我们可以直接丢弃 MTP 模块*”。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/26.webp)
*Deepseek-v3 (2024) https://arxiv.org/pdf/2501.12948 第 2.2 节中方程 (21) 到 (23) 的截图。*

DeepSeek-v3 的方程 (21) 到 (23)，如上所示解释了 MTP 模块，需要花一些功夫才能理解。我制作了一张流程图，以便更容易看清其中的数学。

![](./images/deepseek-v4-and-before-getting-the-foundations-right/27.webp)
*由作者从零开始绘制的图片。用 PowerPoint 和相当多的耐心准备而成。这里，矩阵对应于 d=4。*

## 3 DeepSeek-v4 中的新东西

在 DeepSeek-v4 中，作者一开始就声明，他们“*保留了 Transformer 架构和 MTP 模块，同时引入了若干关键升级…………首先是流形约束超连接 (Manifold-Constrained Hyper-Connections, mHC)，其次是……压缩稀疏注意力 (Compressed Sparse Attention) 和重度压缩注意力 (Heavily Compressed Attention)，第三是……Muon 作为优化器*”，并且“*仍然采用 DeepSeekMoE*……*MTP 配置保持完全相同……所有其他未指明的细节都遵循 DeepSeek-V3 中确立的设置*”。

现在你知道我为什么花了这么多时间来解释 DeepSeek-v3 了。在没有先对 v3 有良好掌握的情况下，你不可能直接跳到 v4。通过学习上面的内容，你实际上已经理解了 DeepSeek-v4 的相当一部分（以及许多领先 LLM 的核心组件）。

### 3.1 *流形约束超连接 (Manifold-Constrained Hyper-Connections, mHC)*

### **3.2 压缩稀疏注意力 (Compressed Sparse Attention, CSA)**

### 3.3 **重度压缩注意力 (Heavily Compressed Attention, HCA)**

### 3.4 Muon 优化器

> 由于这篇文章已经太长了，我会用另一篇文章来跟进，覆盖 3.1 到 3.4，并在这里附上链接。它会在下周上线，假设没有发生太混乱的事情……

*免责声明：所有观点和解读均为作者本人的，而非 MITB 的。我声明我拥有使用此处发布内容的全部权利，没有任何内容是剽窃的。我声明这篇文章是由我撰写的，没有使用任何诸如 ChatGPT 这样的生成式 AI 工具。我声明没有违反任何数据隐私政策，并且就我所知，与此处内容相关的任何数据都是合法获得的。我同意在未事先征得编辑批准的情况下不做任何更改。任何违规行为都可能导致这篇文章被从该出版物中撤回。*
