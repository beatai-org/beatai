# 导数运算法则

## 3.4导数运算法则

### 3.4.1 函数和差求导法则

如果函数u\=u(x)u=u(x)u\=u(x)以及v\=v(x)v=v(x)v\=v(x)都在x点处可导，则：

\[u(x)±v(x)\]′\=u′(x)±v′(x)\[u(x)\\pm v(x)\]' = u'(x)\\pm v'(x)\[u(x)±v(x)\]′\=u′(x)±v′(x)

我们可以根据导数的定义进行证明：

\[u(x)±v(x)\]′\=lim⁡△x→0\[u(x+△x)±v(x+△x)\]−\[u(x)±v(x)\]△x\[u(x)\\pm v(x)\]' = \\lim\_{\\triangle x \\to 0} \\frac{\[u(x+\\triangle x)\\pm v(x+\\triangle x)\]-\[u(x)\\pm v(x)\]}{\\triangle x}\[u(x)±v(x)\]′\=lim△x→0​△x\[u(x+△x)±v(x+△x)\]−\[u(x)±v(x)\]​

\=lim⁡△x→0u(x+△x)−u(x)△x±lim⁡△x→0v(x+△x)−v(x)△x\= \\lim\_{\\triangle x \\to 0} \\frac{u(x+\\triangle x)-u(x)}{\\triangle x}\\pm\\lim\_{\\triangle x \\to 0} \\frac{v(x+\\triangle x)-v(x)}{\\triangle x}\=lim△x→0​△xu(x+△x)−u(x)​±lim△x→0​△xv(x+△x)−v(x)​

\=u′(x)±v′(x)\= u'(x)\\pm v'(x)\=u′(x)±v′(x)

### 3.4.2函数积的求导法则

如果函数u\=u(x)u=u(x)u\=u(x)以及v\=v(x)v=v(x)v\=v(x)都在x点处可导，则：

\[u(x)v(x)\]′\=u′(x)v(x)+u(x)v′(x)\[u(x)v(x)\]' = u'(x)v(x)+u(x)v'(x)\[u(x)v(x)\]′\=u′(x)v(x)+u(x)v′(x)

同样可以利用导数的定义进行证明：

\[u(x)v(x)\]′\=lim⁡△x→0u(x+△x)v(x+△x)−u(x)v(x)△x\[u(x)v(x)\]' = \\lim\_{\\triangle x \\to 0} \\frac{u(x+\\triangle x) v(x+\\triangle x) -u(x)v(x)}{\\triangle x}\[u(x)v(x)\]′\=lim△x→0​△xu(x+△x)v(x+△x)−u(x)v(x)​

\=lim⁡△x→0u(x+△x)v(x+△x)−u(x)v(x+△x)+u(x)v(x+△x)−u(x)v(x)△x\= \\lim\_{\\triangle x \\to 0} \\frac{u(x+\\triangle x) v(x+\\triangle x) -u(x)v(x+\\triangle x)+u(x)v(x+\\triangle x)-u(x)v(x)}{\\triangle x}\=lim△x→0​△xu(x+△x)v(x+△x)−u(x)v(x+△x)+u(x)v(x+△x)−u(x)v(x)​

\=lim⁡△x→0\[u(x+△x)−u(x)\]v(x+△x)+u(x)\[v(x+△x)−v(x)\]△x\= \\lim\_{\\triangle x \\to 0} \\frac{\[u(x+\\triangle x) -u(x)\]v(x+\\triangle x) + u(x)\[v(x+\\triangle x)-v(x)\]}{\\triangle x}\=lim△x→0​△x\[u(x+△x)−u(x)\]v(x+△x)+u(x)\[v(x+△x)−v(x)\]​

\=lim⁡△x→0\[u(x+△x)−u(x)\]△xv(x+△x)+u(x)lim⁡△x→0v(x+△x)−v(x)△x\= \\lim\_{\\triangle x \\to 0} \\frac{\[u(x+\\triangle x) -u(x)\]}{\\triangle x}v(x+\\triangle x)+ u(x)\\lim\_{\\triangle x \\to 0} \\frac{v(x+\\triangle x)-v(x)}{\\triangle x}\=lim△x→0​△x\[u(x+△x)−u(x)\]​v(x+△x)+u(x)lim△x→0​△xv(x+△x)−v(x)​

\=u′(x)lim⁡△x→0v(x+△x)+u(x)v′(x)\= u'(x) \\lim\_{\\triangle x \\to 0} v(x+ \\triangle x)+ u(x) v'(x)\=u′(x)lim△x→0​v(x+△x)+u(x)v′(x)

\=u′(x)v(x)+u(x)v′(x)\= u'(x) v(x)+ u(x) v'(x)\=u′(x)v(x)+u(x)v′(x)

根据函数积的求导法则，可以推出：

当f(x)\=Cg(x)f(x)=Cg(x)f(x)\=Cg(x), 其中C为常数，则有：

f′(x)\=C′g(x)+Cg′(x)\=Cg′(x)f'(x) = C'g(x) + C g'(x) = Cg'(x)f′(x)\=C′g(x)+Cg′(x)\=Cg′(x)

### 3.4.3函数商的求导法则

如果函数u\=u(x)u=u(x)u\=u(x)以及v\=v(x)v=v(x)v\=v(x)都在x点处可导，以及v(x)≠0v(x) \\ne 0v(x)​\=0则：

\[u(x)v(x)\]′\=lim⁡△x→0u(x+△x)v(x+△x)−u(x)v(x)△x\\left \[\\frac{u(x)}{v(x)} \\right \]' = \\lim\_{\\triangle x \\to 0} \\frac{\\frac{u(x+\\triangle x)}{v(x+\\triangle x)}-\\frac{u(x)}{v(x)}}{\\triangle x}\[v(x)u(x)​\]′\=lim△x→0​△xv(x+△x)u(x+△x)​−v(x)u(x)​​

\=lim⁡△x→0u(x+△x)v(x)−u(x)v(x+△x)v(x+△x)v(x)△x\= \\lim\_{\\triangle x \\to 0} \\frac{u(x+\\triangle x) v(x) -u(x)v(x+\\triangle x ) }{v(x+\\triangle x )v(x)\\triangle x }\=lim△x→0​v(x+△x)v(x)△xu(x+△x)v(x)−u(x)v(x+△x)​

\=lim⁡△x→0u(x+△x)v(x)−u(x)v(x)+u(x)v(x)−u(x)v(x+△x)v(x+△x)v(x)△x\= \\lim\_{\\triangle x \\to 0} \\frac{u(x+\\triangle x) v(x)-u(x)v(x)+u(x)v(x)-u(x)v(x+\\triangle x ) }{v(x+\\triangle x )v(x)\\triangle x }\=lim△x→0​v(x+△x)v(x)△xu(x+△x)v(x)−u(x)v(x)+u(x)v(x)−u(x)v(x+△x)​

\=lim⁡△x→0\[u(x+△x)−u(x)\]v(x)−u(x)\[v(x+△x)−v(x)\]v(x+△x)v(x)△x\= \\lim\_{\\triangle x \\to 0} \\frac{\[u(x+\\triangle x) -u(x)\] v(x) -u(x)\[v(x+\\triangle x )-v(x)\] }{v(x+\\triangle x )v(x)\\triangle x }\=lim△x→0​v(x+△x)v(x)△x\[u(x+△x)−u(x)\]v(x)−u(x)\[v(x+△x)−v(x)\]​

\=lim⁡△x→0u(x+△x)−u(x)△xv(x)−u(x)v(x+△x)−v(x)△xv(x+△x)v(x)\= \\lim\_{\\triangle x \\to 0} \\frac{\\frac{u(x+\\triangle x) -u(x)}{\\triangle x} v(x) -u(x)\\frac{v(x+\\triangle x )-v(x)}{\\triangle x} }{v(x+\\triangle x )v(x)}\=lim△x→0​v(x+△x)v(x)△xu(x+△x)−u(x)​v(x)−u(x)△xv(x+△x)−v(x)​​

\=u′(x)v(x)−u(x)v′(x)v2(x)\= \\frac{u'(x)v(x)-u(x)v'(x)}{v^2(x)}\=v2(x)u′(x)v(x)−u(x)v′(x)​

### 3.4.4 链式法则（复合函数求导法则）

如果u\=g(x)u=g(x)u\=g(x)在x点可导，而y\=f(u)y=f(u)y\=f(u)在u\=g(x)u=g(x)u\=g(x)点可导，那么y\=f(g(x))y=f(g(x))y\=f(g(x))在x点可导，并且导数为：

f′(x)\=f′(u)g′(x)f'(x) = f'(u)g'(x)f′(x)\=f′(u)g′(x)

或者表示为：

dydx\=dydu⋅dudx\\frac{\\mathrm{d} y}{\\mathrm{d} x} =\\frac{\\mathrm{d} y}{\\mathrm{d} u}\\cdot \\frac{\\mathrm{d} u}{\\mathrm{d} x}dxdy​\=dudy​⋅dxdu​

首先举个例子帮助你理解。

假如你可以用人民币换美元，可以用美元换比特币。假设在某个时间点，人民币换美元的汇率为0.12，美元对比特币的汇率为0.0001，则人民币对比特币的汇率就可以用0.12乘以0.0001来计算。

下边进行证明。

lim⁡△u→0△y△u\=f′(u)\\lim\_{\\triangle u \\to 0}\\frac{\\triangle y}{\\triangle u}=f'(u)lim△u→0​△u△y​\=f′(u)

⇒△y△u\=f′(u)+α(△u)\\Rightarrow \\frac{\\triangle y}{\\triangle u} = f'(u) + \\alpha (\\triangle u)⇒△u△y​\=f′(u)+α(△u)

α(△u)\\alpha (\\triangle u)α(△u)是当△u⟶0\\triangle u \\longrightarrow 0△u⟶0时的无穷小。上式两边同时乘以△u\\triangle u△u

⇒△y\=f′(u)△u+α(△u)△u\\Rightarrow \\triangle y = f'(u) \\triangle u + \\alpha (\\triangle u) \\triangle u⇒△y\=f′(u)△u+α(△u)△u

等式两边同时除以△x\\triangle x△x,可以推导出：

⇒△y△x\=f′(u)△u△x+α(△u)△u△x\\Rightarrow \\frac{\\triangle y}{\\triangle x} = f'(u) \\frac{\\triangle u}{\\triangle x} + \\alpha (\\triangle u) \\frac{\\triangle u}{\\triangle x}⇒△x△y​\=f′(u)△x△u​+α(△u)△x△u​

然后两边取极限：

⇒lim⁡△x→0△y△x\=lim⁡△x→0\[f′(u)△u△x+α(△u)△u△x\]\\Rightarrow \\lim\_{\\triangle x \\to 0} \\frac{\\triangle y}{\\triangle x} = \\lim\_{\\triangle x \\to 0} \\left \[f'(u) \\frac{\\triangle u}{\\triangle x} + \\alpha (\\triangle u) \\frac{\\triangle u}{\\triangle x}\\right \]⇒lim△x→0​△x△y​\=lim△x→0​\[f′(u)△x△u​+α(△u)△x△u​\]

根据可导函数必连续，可以得知当△x⟶0\\triangle x \\longrightarrow 0△x⟶0 时，△u⟶0\\triangle u \\longrightarrow 0△u⟶0。从而可以得到：

lim⁡△x→0α(△u)\=lim⁡△u→0α(△u)\=0\\lim\_{\\triangle x \\to 0} \\alpha (\\triangle u) = \\lim\_{\\triangle u \\to 0} \\alpha (\\triangle u)=0lim△x→0​α(△u)\=lim△u→0​α(△u)\=0

又因为：

lim⁡△x→0△u△x\=g′(x)\\lim\_{\\triangle x \\to 0} \\frac{\\triangle u}{\\triangle x}=g'(x)lim△x→0​△x△u​\=g′(x)

所以：

lim⁡△x→0△y△x\=f′(u)lim⁡△x→0△u△x\\lim\_{\\triangle x \\to 0} \\frac{\\triangle y}{\\triangle x}=f'(u) \\lim\_{\\triangle x \\to 0} \\frac{\\triangle u}{\\triangle x}lim△x→0​△x△y​\=f′(u)lim△x→0​△x△u​

⇒f′(x)\=f′(u)g′(x)\\Rightarrow f'(x) = f'(u)g'(x)⇒f′(x)\=f′(u)g′(x)

### 3.4.5 例题

我们尝试用上边的导数运算法则对下边这个函数求导：

f(x)\=(exsin⁡x+3x)2f(x)=(e^x \\sin x+3x)^2f(x)\=(exsinx+3x)2

这是一个复合函数求导，我们定义：

u\=g(x)\=exsin⁡x+3xu=g(x)=e^x \\sin x+3xu\=g(x)\=exsinx+3x

则f(u)\=u2f(u)=u^2f(u)\=u2

f′(x)\=f′(u)g′(x)f'(x)=f'(u)g'(x)f′(x)\=f′(u)g′(x)

f′(x)\=2u⋅g′(x)f'(x)=2u \\cdot g'(x)f′(x)\=2u⋅g′(x)

代入u\=g(x)\=exsin⁡x+3xu=g(x)=e^x \\sin x+3xu\=g(x)\=exsinx+3x

f′(x)\=2(exsin⁡x+3x)⋅g′(x)f'(x)=2(e^x \\sin x+3x) \\cdot g'(x)f′(x)\=2(exsinx+3x)⋅g′(x)

接下来需要求g′(x)g'(x)g′(x)

应用求导的四则运算规则有：

则g′(x)\=exsin⁡x+excos⁡x+3g'(x)=e^x \\sin x + e^x \\cos x +3g′(x)\=exsinx+excosx+3

代入f′(x)f'(x)f′(x)的表达式中，得到最终答案：

f′(x)\=2(exsin⁡x+3x)⋅(exsin⁡x+excos⁡x+3)f'(x)=2(e^x \\sin x+3x) \\cdot (e^x \\sin x + e^x \\cos x +3)f′(x)\=2(exsinx+3x)⋅(exsinx+excosx+3)
