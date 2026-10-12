// KaTeX 自动渲染：配合 pymdownx.arithmatex（generic 模式）
//
// 正文里写 $...$（行内）和 $$...$$（块级），arithmatex 会把它们统一规范化成
// \(...\) 和 \[...\] 再输出，所以这里只需要认这两种定界符。
//
// 特意不在这里加 $ 定界符：$ 的判定留给 arithmatex 那一层，这样正文里的货币
// 写法（如「花了 $5 和 $10」）才不会被误判成公式。
document$.subscribe(({ body }) => {
  renderMathInElement(body, {
    delimiters: [
      { left: "\\(", right: "\\)", display: false }, // 行内公式
      { left: "\\[", right: "\\]", display: true }   // 块级公式
    ],
    // 代码块、预格式化文本里不渲染公式
    ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
    // 渲染失败时不抛异常，改为把出错的地方标红显示
    throwOnError: false
  });
});