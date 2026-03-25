# 动手实现多元线性回归

## 5.5动手实现多元线性回归

本节我们将用python代码，利用梯度下降算法，实现一个多元线性回归。也是时候写一些代码了。

### 5.5.1已知条件

#### 数据

| 温度 | 价格（元） | 销量（个） |
| --- | --- | --- |
| 10 | 3 | 60 |
| 20 | 3 | 85 |
| 25 | 3 | 100 |
| 28 | 2.5 | 120 |
| 30 | 2 | 140 |
| 35 | 2.5 | 145 |
| 40 | 2.5 | 163 |

#### 多元线性回归公式

我们用x1x\_1x1​表示温度， x2x\_2x2​表示价格，yyy表示销量。

w0w\_0w0​表示截距，w1w\_1w1​表示温度对应的权重，w2w\_2w2​表示价格对应的权重。

则预测的销量为：

y^\=w0+w1x1+w2x2\\hat{y}=w\_0+w\_1x\_1+w\_2x\_2y^​\=w0​+w1​x1​+w2​x2​

#### 损失函数

损失函数我们用MSE，我们有7个数据，所以：

loss\=17∑i\=17(y^i−yi)2loss = \\frac{1}{7}\\sum\_{i=1}^{7}(\\hat{y}^i-y^i)^2loss\=71​∑i\=17​(y^​i−yi)2

带入线性回归方程有：

loss\=17∑i\=17(w0+w1x1i+w2x2i−yi)2loss = \\frac{1}{7}\\sum\_{i=1}^{7}(w\_0+w\_1x\_1^i+w\_2x\_2^i-y^i)^2loss\=71​∑i\=17​(w0​+w1​x1i​+w2​x2i​−yi)2

### 5.5.2 用梯度下降算法更新参数

我们用梯度下降算法逐步来更新参数w0,w1,w2w\_0,w\_1,w\_2w0​,w1​,w2​。

#### 梯度计算

利用损失函数对每个参数求偏导：

-   w0w\_0w0​的偏导数：

∂loss∂w0\=27∑i\=17(w0+w1x1i+w2x2i−yi)\\frac{\\partial loss}{\\partial w\_0} = \\frac{2}{7} \\sum\_{i=1}^{7} (w\_0 + w\_1 x\_1^i + w\_2 x\_2^i - y^i)∂w0​∂loss​\=72​∑i\=17​(w0​+w1​x1i​+w2​x2i​−yi)

-   w1w\_1w1​的偏导数：

∂loss∂w1\=27∑i\=17(w0+w1x1i+w2x2i−yi)⋅x1i\\frac{\\partial loss}{\\partial w\_1} = \\frac{2}{7} \\sum\_{i=1}^{7} (w\_0 + w\_1 x\_1^i + w\_2 x\_2^i - y^i) \\cdot x\_1^i∂w1​∂loss​\=72​∑i\=17​(w0​+w1​x1i​+w2​x2i​−yi)⋅x1i​

-   w2w\_2w2​的偏导数：

∂loss∂w2\=27∑i\=17(w0+w1x1i+w2x2i−yi)⋅x2i\\frac{\\partial loss}{\\partial w\_2} = \\frac{2}{7} \\sum\_{i=1}^{7} (w\_0 + w\_1 x\_1^i + w\_2 x\_2^i - y^i) \\cdot x\_2^i∂w2​∂loss​\=72​∑i\=17​(w0​+w1​x1i​+w2​x2i​−yi)⋅x2i​

#### 参数更新

在每次迭代中，参数按照以下规则更新：

w0\=w0−lr⋅∂loss∂w0w\_0=w\_0-lr\\cdot\\frac{\\partial loss}{\\partial w\_0}w0​\=w0​−lr⋅∂w0​∂loss​

  

w1\=w1−lr⋅∂loss∂w1w\_1=w\_1-lr\\cdot\\frac{\\partial loss}{\\partial w\_1}w1​\=w1​−lr⋅∂w1​∂loss​

  

w2\=w2−lr⋅∂loss∂w2w\_2=w\_2-lr\\cdot\\frac{\\partial loss}{\\partial w\_2}w2​\=w2​−lr⋅∂w2​∂loss​

其中lrlrlr为学习率。

### 5.5.3 Python实现

```
# Feature 数据
X = [[10, 3], [20, 3], [25, 3], [28, 2.5], [30, 2], [35, 2.5], [40, 2.5]]
y = [60, 85, 100, 120, 140, 145, 163]  # Label 数据
# 初始化参数
w = [0.0, 0.0, 0.0]  # w0, w1, w2
lr = 0.0001  # 学习率
num_iterations = 10000  # 迭代次数
# 梯度下降
for i in range(num_iterations):
    # 预测值
    y_pred = [w[0] + w[1] * x[0] + w[2] * x[1] for x in X]
    # 计算损失
    loss = sum((y_pred[j] - y[j]) ** 2 for j in range(len(y))) / len(y)
    # 计算梯度
    grad_w0 = 2 * sum(y_pred[j] - y[j] for j in range(len(y))) / len(y)
    grad_w1 = 2 * sum((y_pred[j] - y[j]) * X[j][0] for j in range(len(y))) / len(y)
    grad_w2 = 2 * sum((y_pred[j] - y[j]) * X[j][1] for j in range(len(y))) / len(y)
    # 更新参数
    w[0] -= lr * grad_w0
    w[1] -= lr * grad_w1
    w[2] -= lr * grad_w2
    # 打印损失
    if i % 100 == 0:
        print(f"Iteration {i}: Loss = {loss}")
# 输出最终参数
print(f"Final parameters: w0 = {w[0]}, w1 = {w[1]}, w2 = {w[2]}")
```

你可以尝试调整学习率，迭代次数。学习率太大的话，训练过程不会收敛，loss值可能会越来越大，直到程序出错。

恭喜你！你完成了你第一个模型的训练。
