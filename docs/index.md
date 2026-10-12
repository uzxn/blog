---
title: 首页
hide:
  - navigation
  - toc
---

# 技术笔记

记录技术、思考与折腾的过程。

<div class="grid cards" markdown>

- :material-post-outline: **博客**

    ---

    按时间倒序浏览全部文章，支持分类与标签筛选。

    [:octicons-arrow-right-24: 进入博客](blog/index.md)

- :material-tag-outline: **标签**

    ---

    按主题查找内容。

    [:octicons-arrow-right-24: 浏览标签](tags.md)

- :material-account-outline: **关于**

    ---

    关于我和这个站点。

    [:octicons-arrow-right-24: 了解更多](about.md)

</div>

## 数学公式支持

本站使用 [KaTeX](https://katex.org/) 渲染公式，在 Markdown 里直接写 LaTeX 即可。行内公式用 `$ ... $`，例如质能方程 $E = mc^2$；块级公式用 `$$ ... $$`，并且要独占一行：

$$
\int_{-\infty}^{\infty} e^{-x^2}\,\mathrm{d}x = \sqrt{\pi}
$$

## 写作示例

```python
def fibonacci(n: int) -> int:
    """返回第 n 个斐波那契数"""
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

更多用法见 [博客](blog/index.md)。