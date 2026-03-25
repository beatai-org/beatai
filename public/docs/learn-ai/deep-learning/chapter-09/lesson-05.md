# Adam优化器

## 9.5 Adam优化器

Adam(Adaptive Moment Estimation)，结合了Momentum优化器和RMSProp优化器的优点，目前已经是深度学习领域默认的优化器。 Adam优化器同时利用动量来给梯度更新增加惯性和震荡阻尼，也利用历史梯度的均方根来自适应调整学习率。下边我们给出它的具体计算过程。

首先计算参数w的梯度：

gw\=∂loss∂wg\_w=\\frac{\\partial loss}{\\partial w}gw​\=∂w∂loss​

然以后计算并更新一阶矩指数加权平均值VwV\_wVw​，和二阶矩指数加权平均值SwS\_wSw​。

Vw\=β1Vw+(1−β1)gwV\_w=\\beta\_1V\_w+(1-\\beta\_1)g\_wVw​\=β1​Vw​+(1−β1​)gw​

Sw\=β2Sw+(1−β2)gw2S\_w=\\beta\_2S\_w+(1-\\beta\_2){g\_w}^2Sw​\=β2​Sw​+(1−β2​)gw​2

β1\=0.9;β2\=0.999\\beta\_1=0.9;\\beta\_2=0.999β1​\=0.9;β2​\=0.999

接着对这两个值进行校正：

Vwcorrect\=Vw1−β1tV\_w^{correct}=\\frac{V\_w}{1-{\\beta\_1}^t}Vwcorrect​\=1−β1​tVw​​

Swcorrect\=Sw1−β2tS\_w^{correct}=\\frac{S\_w}{1-{\\beta\_2}^t}Swcorrect​\=1−β2​tSw​​

最后更新参数：

w\=w−lrVwcorrectSwcorrect+εw=w-lr\\frac{V\_w^{correct}}{\\sqrt{S\_w^{correct}}+\\varepsilon}w\=w−lrSwcorrect​​+εVwcorrect​​

Adam优化器可以稳定且迅速的训练深度神经网络，但是它需要为每个参数额外在显存里保存两个值：V和S，来记录梯度的一阶和二阶指数加权平均值。这占据了大量宝贵的显存空间。
