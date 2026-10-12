---
date: 2026-10-11
slug: welcome
authors:
  - yourname
categories:
  - 随笔
tags:
  - MkDocs
  - 建站
---

# 博客开张：为什么用 MkDocs

折腾过 Hexo、Hugo，最后又回到了 MkDocs。原因很简单：**内容就是纯 Markdown，配置就是一个 YAML，没有前端构建的负担。**

## 这套博客的结构

一篇新文章只需要在 `docs/blog/posts/` 下新建一个 `.md` 文件，头部写好元信息即可：

```markdown
---
date: 2026-10-11
authors:
  - yourname
categories:
  - 技术
tags:
  - Python
---

# 标题

正文……
```

文件名会成为 URL 的一部分，同时文件名的前缀日期决定排序。

## 一些用得到的写法

!!! tip "提示块"
    支持 admonition，用来写提示、警告、示例都很方便。

!!! warning "注意"
    发布前记得把 `mkdocs.yml` 里的 `site_url`、`repo_url` 和作者信息改成自己的。

折叠内容：

??? note "点击展开"
    这里是被折叠的正文内容。

任务列表：

- [x] 搭好站点骨架
- [x] 接入数学公式
- [ ] 写第一篇正式文章

## 本地预览

```bash
pip install -r requirements.txt
mkdocs serve          # 打开 http://127.0.0.1:8000
mkdocs build --strict # 构建到 site/ 目录
```

下一篇记录一下公式排版的具体用法。