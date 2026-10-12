---
date: 2026-10-11
slug: math-typesetting
authors:
  - yourname
categories:
  - 技术
tags:
  - LaTeX
  - KaTeX
  - MkDocs
---

# 数学公式排版速查

本站用 [KaTeX](https://katex.org/) 渲染 LaTeX。写法就是 GitHub 那一套：行内用单美元符 `$ ... $`，行间（块级）用双美元符 `$$ ... $$`。KaTeX 体积小、渲染快，代价是支持的宏比 MathJax 少一些（见文末排错提示）。

## 行内与块级

行内公式用 `$ ... $`，比如勾股定理 $a^2 + b^2 = c^2$，它会自然地嵌在句子里。

块级公式用 `$$ ... $$`，**要独占一行**（前后留空行），会单独居中成行：

$$
e^{i\pi} + 1 = 0
$$

块级公式也可以写成 `$$` 和公式分行、`$$` 单独收尾的多行形式，内容长的时候更好读：

$$
\int_{-\infty}^{\infty} e^{-x^2}\,\mathrm{d}x = \sqrt{\pi}
$$

## 上下标与希腊字母

下标 `_`、上标 `^`，多个字符记得加花括号：

$$
x_{i,j}^{(k)} = \alpha \cdot \beta^2 + \frac{\partial f}{\partial t}
$$

常用希腊字母：$\alpha$ `\alpha`、$\theta$ `\theta`、$\Sigma$ `\Sigma`、$\Omega$ `\Omega`。

## 分数、根号与求和

$$
\mathrm{RMSE} = \sqrt{ \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2 }
$$

多重积分与极限：

$$
\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e,
\qquad
\oint_{\partial \Omega} \mathbf{F} \cdot \mathrm{d}\mathbf{S}
= \iiint_{\Omega} (\nabla \cdot \mathbf{F})\, \mathrm{d}V
$$

## 多行与对齐

用 `aligned` 环境让等号对齐：

$$
\begin{aligned}
(x+y)^2 &= (x+y)(x+y) \\
        &= x^2 + 2xy + y^2 \\
        &= x^2 + y^2 + 2xy
\end{aligned}
$$

分段函数用 `cases`：

$$
f(x) =
\begin{cases}
x^2, & x \ge 0 \\
-x,  & x < 0
\end{cases}
$$

## 矩阵

$$
\mathbf{A} =
\begin{pmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{pmatrix},
\qquad
\mathbf{A}^{\mathsf{T}}\mathbf{A} = \mathbf{I}
$$

## 一个真实的例子

正态分布的概率密度函数：

$$
p(x \mid \mu, \sigma^2) =
\frac{1}{\sqrt{2\pi\sigma^2}}
\exp\!\left( -\frac{(x-\mu)^2}{2\sigma^2} \right)
$$

贝叶斯公式：

$$
P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B)}
$$

## 排错提示

- 公式**不生效**：先检查三个最常见的坑——
    1. 块级公式必须**独占一行**，`$$E=mc^2$$ 后面还有正文` 这种写法会被拆坏；
    2. `$` 和公式之间**不能有空格**，`$ x $` 不会被识别，要写 `$x$`；
    3. 页面上显示的是**红色源码**，说明 KaTeX 不认识这个宏，按提示换成等价的受支持写法。
- 正文里的**货币符号**不会被误判：花了 $5 和 $10 会原样显示（不会变成公式）。真要单独写一个美元金额时可以用 `\$` 转义，例如 `\$5`。
- **MathJax 专有宏**（如化学式扩展 `mhchem` 的 `\ce{}`）KaTeX 不支持。这类内容要么改用 `\text{}` 手写，要么单独为页面换回 MathJax。
- 公式**太长溢出**：本站在 CSS 里给块级公式加了横向滚动，正常不会撑破布局。
- 公式在**代码块/行内代码**里不会被渲染，写教程示例时直接用反引号包起来即可。