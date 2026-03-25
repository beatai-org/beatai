# BLEU评价指标

## 14.2 BLEU评价指标

之前我们说过，做一个深度学习项目，一定要先确定一个对模型的衡量指标。这个指标是单一数值的，可以定量的衡量模型的表现，它是引导整个项目的关键指标。

BLEU（Bilingual Evaluation Understudy）是机器翻译中最常用的自动评价指标之一，它衡量的是机器翻译结果和一个或多个参考译文之间的相似度。

BLEU指标的取值范围为\[0,1\]之间，值越大代表机器翻译与参考译文越相似，表明翻译效果越好。

| BLEU得分 | 模型表现 |
| --- | --- |
| 0-0.1 | 差，基本不可读 |
| 0.1-0.2 | 可表达大体意思，有时会有错误 |
| 0.2-0.3 | 基本流畅可用，有一定错误或者不自然 |
| 0.3-0.4 | 很流畅，但不完美 |
| 0.4-0.5 | 很好，接近人工翻译 |
| 0.5-1.0 | 非常好（罕见） |

### 14.2.1 BLEU原理

BLEU的大致原理是：

-   将模型翻译句子和参考译文都转化成token序列。
-   计算每个模型翻译的token在参考译文的token序列中出现率p1p\_1p1​。
-   计算每两个连续翻译token序列在参考token序列中的出现率p2p\_2p2​。
-   计算每三个，每四个连续翻译token序列在参考token序列中的出现率p3,p4p\_3,p\_4p3​,p4​。
-   综合p1,p2,p3,p4p\_1,p\_2,p\_3,p\_4p1​,p2​,p3​,p4​，并惩罚模型输出翻译太短的情况，得到BLEU最终得分。

### 14.2.2 调用BLEU

首先安装依赖库：

```
pip install sacrebleu
```

BLEU score对于一个机器翻译出来的句子，可以有多个参考的翻译。这是因为一个意思可以有多种不同的表达方式。如果想要BLEU值准确，就应该提供各种可能得参考翻译。但在我们这个demo的数据里，每个翻译只有一个参考答案。具体调用BLEU的代码：

```
import sacrebleu

# 单个参考译文列表
references = [
    "今天天气很好。",
    "我喜欢在雨天散步。",
    "今天要早点下班。"
]

# 模型生成的候选翻译
hypotheses = [
    "今日天气不错。",
    "下雨的时候我喜欢散步。",
    "今天下班要早些。"
]

# sacrebleu 需要 references 是 list[list[str]]
# 即使只有一个参考，也要是内层 list
references = [references]  # 变成：[[ref1, ref2, ref3]]

# 计算 BLEU
bleu = sacrebleu.corpus_bleu(hypotheses, references, tokenize='zh')

print(f"BLEU score: {bleu.score:.2f}")
```

运行后，可以看到，BLEU得分为16.31，注意这里输出的是百分比，对应实际BLEU值为0.1631。需要注意一点，在调用`sacrebleu.corpus_bleu`时，需要设置正确的分词方式，我们这里是对中文进行分词，需要设置`tokenize='zh'`。sacrebleu库里对中文的分词是单个字认为是一个token。

### 14.2.3 BLEU详解

如果你不想了解BLEU的细节，本章节你看到这里就可以停止了。你只要知道BLEU是衡量模型翻译好坏的指标，取值范围\[0-1\]，越大越好。0.3以上就表示该翻译模型基本可用。这些知识就可以让你利用BLEU来评价你的翻译模型了。

接下来我们就来详细了解BLEU的计算过程。

#### 14.2.3.1 p1p\_1p1​

准确率p1p\_1p1​衡量的是模型翻译的单个token参照参考翻译的准确率。

假设参考翻译TrT\_rTr​为“今天天气很好”，模型翻译TmT\_mTm​为：“今天今天今天” 都按照单个字为一个token来拆解，则TmT\_mTm​里有两个不同的token：“今”、“天”。这两个token也都出现在TrT\_rTr​的token序列里。我们是否就可以定义p1\=1p\_1=1p1​\=1呢？当然不行，这个翻译明显是个很差的翻译。BLEU的具体做法如下：

| token | count(Tm,token)count(T\_m,token)count(Tm​,token) | min(count(Tm,token),count(Tr,token))min(count(T\_m,token),count(T\_r,token))min(count(Tm​,token),count(Tr​,token)) |
| --- | --- | --- |
| 今 | 3 | 1 |
| 天 | 3 | 2 |

上表中第二列统计了对于某个token在TmT\_mTm​中出现的个数，把这个值叫做countcountcount。上表中第三列统计了对于某个token在Tm,TrT\_m,T\_rTm​,Tr​中出现较小的那个count值，把这个值叫做clip\_countclip\\\_countclip\_count。

则有：

p1\=∑clip\_count∑count\=3/6\=0.5 p\_1 = \\frac{\\sum clip\\\_count}{\\sum count}=3/6 =0.5 p1​\=∑count∑clip\_count​\=3/6\=0.5

#### 14.2.3.2 p2p\_2p2​

准确率p2p\_2p2​衡量的是模型翻译token序列中两个连续token参照参考翻译的准确率。

假设参考翻译TrT\_rTr​为“今天天气不错”，模型翻译TmT\_mTm​为：“今天今天不错”。

则TmT\_mTm​中2个不同的连续token序列为“今天”、“天今”、“天不”、“不错”

| token | count(Tm,token)count(T\_m,token)count(Tm​,token) | min(count(Tm,token),count(Tr,token))min(count(T\_m,token),count(T\_r,token))min(count(Tm​,token),count(Tr​,token)) |
| --- | --- | --- |
| 今天 | 2 | 1 |
| 天今 | 1 | 0 |
| 天不 | 1 | 0 |
| 不错 | 1 | 1 |

p1\=∑clip\_count∑count\=2/5\=0.4 p\_1 = \\frac{\\sum clip\\\_count}{\\sum count}=2/5 =0.4 p1​\=∑count∑clip\_count​\=2/5\=0.4

同理你可以求出p3,p4p\_3,p\_4p3​,p4​

#### 14.2.3.3 对p值求平均

我们求得了p1,p2,p3,p4p\_1,p\_2,p\_3,p\_4p1​,p2​,p3​,p4​之后，如何综合考虑对不同长度序列的翻译精度呢？最简单的方式是求算数平均值，但是算数平均数有个问题，它不能突出这一组数中的小值。有可能p1,p2,p3p\_1,p\_2,p\_3p1​,p2​,p3​很大，p4p\_4p4​为0，这样均值还是一个不错的值。但这不是我们希望的结果，我们希望这个均值对每个小的p值都会很敏感。这时就需要用到几何平均数。这里我们考虑p1,p2,p3,p4p\_1,p\_2,p\_3,p\_4p1​,p2​,p3​,p4​对结果的权重都是相同的，都为1/4。则它的几何平均数为：

∏n\=14Pn14 \\prod\_{n=1}^{4}P\_n^{\\frac{1}{4}} n\=1∏4​Pn41​​

我们举个例子：

p1\=0.9p\_1=0.9p1​\=0.9

p2\=0.7p\_2=0.7p2​\=0.7

p3\=0.4p\_3=0.4p3​\=0.4

p4\=0.0p\_4=0.0p4​\=0.0

算数平均：(0.9+0.7+0.4+0.0)/4\=0.5(0.9+0.7+0.4+0.0)/4=0.5(0.9+0.7+0.4+0.0)/4\=0.5

几何平均：0.9⋅0.7⋅0.4⋅0.04\=0\\sqrt\[4\]{0.9\\cdot 0.7\\cdot 0.4 \\cdot 0.0} =040.9⋅0.7⋅0.4⋅0.0​\=0

另外直接用几何平均数的连乘形式，有可能多个很小的数连乘，造成float无法表示。所以一般用它的另一种等价表示方式：

∏n\=14Pn14\=exp(∑n\=1414log⁡pn) \\prod\_{n=1}^{4}P\_n^{\\frac{1}{4}}=exp(\\sum\_{n=1}^{4} {\\frac{1}{4}\\log{p\_n}}) n\=1∏4​Pn41​​\=exp(n\=1∑4​41​logpn​)

#### 14.2.3.4 短句惩罚

假设参考翻译TrT\_rTr​为“今天天气很好”，模型翻译TmT\_mTm​为：“今天天气”。可以看到如果模型输出短句的话，它的准确率会很高，但是实际效果却很差。所以需要对短句进行惩罚。做法就是在上边的p值几何平均数的结果上乘一个值。

BP\={1 if m\>rexp(1−rm) if m≤r BP=\\begin{cases} 1 & \\text{ if } m>r \\\\ exp(1-\\frac{r}{m}) & \\text{ if } m\\le r \\end{cases} BP\={1exp(1−mr​)​ if m\>r if m≤r​

其中r表示参考翻译的长度，m表示模型翻译的长度。

#### 14.2.3.5 最终公式

BLEU\=BP⋅exp(∑n\=1414log⁡pn) BLEU=BP\\cdot exp(\\sum\_{n=1}^{4} {\\frac{1}{4}\\log{p\_n}}) BLEU\=BP⋅exp(n\=1∑4​41​logpn​)

上边我们默认p1,p2,p3,p4p\_1,p\_2,p\_3,p\_4p1​,p2​,p3​,p4​的权重都是1/4。你也可以单独对每个p值设置不同的权重。wnw\_nwn​为pnp\_npn​对应的权重，公式就变为：

BLEU\=BP⋅exp(∑n\=14wnlog⁡pn) BLEU=BP\\cdot exp(\\sum\_{n=1}^{4} {w\_n\\log{p\_n}}) BLEU\=BP⋅exp(n\=1∑4​wn​logpn​)

你只要理解BLEU的原理就行，实际中不需要自己动手实现。
