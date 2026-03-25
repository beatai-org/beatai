# 常用求导公式

## 3.3 常用求导公式

### 3.3.1幂函数的导函数

我们首先根据导函数的定义来推出f(x)\=x2f(x)=x^2f(x)\=x2的导函数。  
  

f′(x)\=lim⁡△x→0f(x+△x)−f(x)△x\=lim⁡△x→0(x+△x)2−x2△xf'(x)=\\lim\_{\\triangle x \\to 0}\\frac{f(x+\\triangle x)-f(x)}{\\triangle x}=\\lim\_{\\triangle x \\to 0}\\frac{(x+\\triangle x)^2-x^2}{\\triangle x}f′(x)\=lim△x→0​△xf(x+△x)−f(x)​\=lim△x→0​△x(x+△x)2−x2​  
  
\=lim⁡△x→0x2+2x△x+△x2−x2△x\=\\lim\_{\\triangle x \\to 0}\\frac{x^2+2x\\triangle x+{\\triangle x}^2-x^2}{\\triangle x}\=lim△x→0​△xx2+2x△x+△x2−x2​  
  
\=lim⁡△x→02x△x+△x2△x\=\\lim\_{\\triangle x \\to 0}\\frac{2x\\triangle x+{\\triangle x}^2}{\\triangle x}\=lim△x→0​△x2x△x+△x2​  
  
\=2x+lim⁡△x→0△x\=2x+\\lim\_{\\triangle x \\to 0}{\\triangle x}\=2x+lim△x→0​△x  
  
\=2x\=2x\=2x

  
  
接下来我们推导一下f(x)\=xnf(x)=x^nf(x)\=xn的导函数。

**二项式定理**  
  

(a+b)n\=∑k\=0nCnkan−kbk(a + b)^n = \\sum\_{k=0}^n C\_{n}^{k}a^{n-k} b^k(a+b)n\=∑k\=0n​Cnk​an−kbk

  
  
首先复习一下二项式定理，n个（a+b）相乘，实际展开式中的每一项都是n个数的乘积。n个数里要么是a，要么是b。n个数里有k个a，n-k个b的概率就为CnkC\_{n}^{k}Cnk​

接下来我们进行幂函数的导函数推导：  
  

f′(x)\=lim⁡△x→0f(x+△x)−f(x)△x\=lim⁡△x→0(x+△x)n−xn△xf'(x)=\\lim\_{\\triangle x \\to 0}\\frac{f(x+\\triangle x)-f(x)}{\\triangle x}=\\lim\_{\\triangle x \\to 0}\\frac{(x+\\triangle x)^n-x^n}{\\triangle x}f′(x)\=lim△x→0​△xf(x+△x)−f(x)​\=lim△x→0​△x(x+△x)n−xn​

  
  
对于(x+△x)n{(x+\\triangle x)}^n(x+△x)n部分利用二项式定理展开：  
  

(x+△x)n\=xn+nxn−1△x+n(n−1)2xn−2△x2+⋅⋅⋅+△xn{(x+\\triangle x)}^n=x^n + nx^{n-1}\\triangle x+\\frac{n(n-1)}{2}x^{n-2}{\\triangle x}^2+\\cdot\\cdot\\cdot+{\\triangle x}^n(x+△x)n\=xn+nxn−1△x+2n(n−1)​xn−2△x2+⋅⋅⋅+△xn

  
  
将展开式带入幂函数求导极限式中有：  
  

f′(x)\=lim⁡△x→0nxn−1△x+n(n−1)2xn−2△x2+⋅⋅⋅+△xn△xf'(x)=\\lim\_{\\triangle x \\to 0}\\frac{nx^{n-1}\\triangle x+\\frac{n(n-1)}{2}x^{n-2}{\\triangle x}^2+\\cdot\\cdot\\cdot+{\\triangle x}^n}{\\triangle x}f′(x)\=lim△x→0​△xnxn−1△x+2n(n−1)​xn−2△x2+⋅⋅⋅+△xn​  
  
f′(x)\=lim⁡△x→0nxn−1+(n−1)xn−2△x+⋅⋅⋅+△xn−1f'(x)=\\lim\_{\\triangle x \\to 0}{nx^{n-1}+(n-1)x^{n-2}{\\triangle x}+\\cdot\\cdot\\cdot+{\\triangle x}^{n-1}}f′(x)\=lim△x→0​nxn−1+(n−1)xn−2△x+⋅⋅⋅+△xn−1  
  
f′(x)\=nxn−1f'(x)=nx^{n-1}f′(x)\=nxn−1

  
  
所以最终得到f(x)\=xnf(x)=x^nf(x)\=xn的导函数为nxn−1nx^{n-1}nxn−1

### 3.3.2 常见函数的导函数

毕竟我们这个不是高数课，就不一一推导每种常见函数的导函数了。这里给出公式，都是必须记住的。

**常数求导**

如果f(x)\=Cf(x)=Cf(x)\=C，C为常数，则：f′(x)\=0f'(x)=0f′(x)\=0。导数描述的是因变量针对自变量而言在某一点的变化率，函数值为常数，变化率一直为0。

**幂函数求导**

如果f(x)\=xnf(x)=x^nf(x)\=xn，其中n为**实数**，则f′(x)\=nxn−1f'(x)=nx^{n-1}f′(x)\=nxn−1

**指数函数求导**

如果f(x)\=axf(x)=a^xf(x)\=ax,其中(a\>0;a≠1)(a>0;a\\ne1)(a\>0;a​\=1), 则f′(x)\=axln⁡af'(x)=a^x \\ln af′(x)\=axlna

特别的如果f(x)\=exf(x)=e^xf(x)\=ex,则f′(x)\=exf'(x)=e^xf′(x)\=ex (导函数和原函数相同）

**对数函数求导**

如果f(x)\=log⁡axf(x)=\\log\_{a}{x} f(x)\=loga​x,其中(a\>0;a≠1)(a>0;a\\ne1)(a\>0;a​\=1),则f′(x)\=1xln⁡af'(x)=\\frac{1}{x \\ln a}f′(x)\=xlna1​

特别的，如果f(x)\=ln⁡xf(x) = \\ln xf(x)\=lnx,则f′(x)\=1xf'(x) = \\frac{1}{x}f′(x)\=x1​

**三角函数求导**

如果f(x)\=sin⁡xf(x)=\\sin xf(x)\=sinx，则f′(x)\=cos⁡xf'(x)=\\cos xf′(x)\=cosx

如果f(x)\=cos⁡xf(x)=\\cos xf(x)\=cosx，则f′(x)\=−sin⁡xf'(x)=-\\sin xf′(x)\=−sinx
