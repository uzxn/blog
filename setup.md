# 本地搭建与部署指南

一套 MkDocs + Material 主题的技术博客，支持 KaTeX 数学公式（行内 `$...$`、行间 `$$...$$`）。

## 目录结构

```
.
├── mkdocs.yml                 # 站点配置（主题、插件、Markdown 扩展）——最常改的文件
├── requirements.txt           # Python 依赖
├── .gitignore
├── .github/workflows/deploy.yml   # GitHub Actions 自动部署
└── docs/                      # 所有内容都在这里
    ├── index.md               # 首页
    ├── about.md               # 关于
    ├── tags.md                # 标签索引页
    ├── javascripts/katex.js   # KaTeX 渲染桥接
    ├── stylesheets/extra.css  # 中文字体栈、公式溢出处理
    └── blog/
        ├── index.md
        ├── .authors.yml       # 作者信息
        └── posts/             # 文章放这里
            ├── welcome.md
            └── math-typesetting.md
```

## 1. 环境要求

- **Python 3.9 或更高**（`python3 --version` 检查）
- **Git**
- 构建产物会自动生成到 `site/` 目录，不需要手动创建

## 2. 本地搭建

### 2.1 建议用虚拟环境

```bash
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
```

### 2.2 安装依赖

```bash
pip install -r requirements.txt
```

### 2.3 本地预览

```bash
mkdocs serve
```

打开 <http://127.0.0.1:8000>。改 `docs/` 里的文件或 `mkdocs.yml` 后会自动热重载，不用重启。

端口被占用时换一个：`mkdocs serve -a 127.0.0.1:8001`。

### 2.4 构建静态文件

```bash
mkdocs build            # 输出到 site/
mkdocs build --strict   # 把警告当成错误，适合在 CI 里用
```

## 3. 先改成你自己的信息

| 改什么 | 在哪 |
| --- | --- |
| 站点名称、描述、作者 | [mkdocs.yml](mkdocs.yml) 顶部的 `site_name` / `site_description` / `site_author` |
| 部署域名 | `mkdocs.yml` 的 `site_url`（见第 5 节，务必填对） |
| GitHub 仓库链接 | `mkdocs.yml` 的 `repo_url` / `repo_name` |
| 页脚版权 | `mkdocs.yml` 的 `copyright` |
| 社交链接（GitHub、邮箱） | `mkdocs.yml` 的 `extra.social` |
| 作者昵称、头像、主页 | [docs/blog/.authors.yml](docs/blog/.authors.yml) |
| 个人介绍 | [docs/about.md](docs/about.md) |

## 4. 写一篇新文章

在 `docs/blog/posts/` 下新建 `.md` 文件，头部元信息格式如下：

```markdown
---
date: 2026-10-11
slug: my-first-post
authors:
  - yourname
categories:
  - 技术
tags:
  - Python
---

# 文章标题

正文……
```

- `date` 决定排序，`slug` 决定 URL（不写会用标题自动生成，中文标题会生成中文 URL，建议手写英文 slug）
- `authors` 里的 `yourname` 要和 `.authors.yml` 里的 key 一致
- `categories` 和 `tags` 会分别生成分类页和标签索引

### 数学公式写法

行内用单美元符，行间用双美元符：

```markdown
质能方程 $E = mc^2$ 是行内公式。

$$
\int_{-\infty}^{\infty} e^{-x^2}\,\mathrm{d}x = \sqrt{\pi}
$$
```

两个容易踩的坑：

1. `$$ ... $$` **必须独占一行**（前后留空行），后面不能跟正文
2. `$` 和公式之间**不能有空格**，要写 `$x$` 而不是 `$ x $`

正文里的货币符号（如 `花了 $5 和 $10`）不会被误判成公式，放心写。

## 5. 上传到 GitHub Pages

### 5.1 建仓库

推荐把仓库命名为 **`<你的用户名>.github.io`**，例如 `octocat.github.io`。这样站点地址就是 `https://octocat.github.io/`，最省事，不用处理子路径。

如果想用别的仓库名（比如 `my-blog`），站点地址会变成 `https://octocat.github.io/my-blog/`，这时 `mkdocs.yml` 里的 `site_url` 要写成完整的带子路径地址。

GitHub Pages 在**公开仓库**上免费；私有仓库需要付费账号。

### 5.2 首次推送代码

```bash
git init
git add .
git commit -m "初始化博客"
git branch -M main
git remote add origin git@github.com:<你的用户名>/<你的用户名>.github.io.git
git push -u origin main
```

> 用 HTTPS 的话，把 remote 换成 `https://github.com/<用户名>/<仓库名>.git`。
> 先创建好远端空仓库，不要勾选初始化 README，否则推送会冲突。

### 5.3 开启 Pages

仓库页面 → **Settings** → **Pages** → **Build and deployment** → **Source** 选 **GitHub Actions**。

之后每次 `git push` 到 `main`，[.github/workflows/deploy.yml](.github/workflows/deploy.yml) 会自动构建并发布。跑完在仓库的 **Actions** 标签页能看到进度，成功后站点地址就是 `https://<你的用户名>.github.io/`。

首次部署可能要等一两分钟才会生效。

### 5.4 备选方案：`mkdocs gh-deploy`

不想用 Actions 的话，可以在本地一条命令把构建结果推到 `gh-pages` 分支：

```bash
mkdocs gh-deploy
```

然后去 **Settings → Pages → Source** 选 **Deploy from a branch**，分支选 `gh-pages`，目录选 `/ (root)`。

`gh-deploy` 会自动创建 `gh-pages` 分支并写入 `.nojekyll`（否则 Material 主题里带下划线的资源会被 Jekyll 吞掉）。如果之后报分支冲突，用 `mkdocs gh-deploy --force` 覆盖。

**注意**：这个方式要求本地先 commit 好，因为 `gh-deploy` 会把当前 `docs/` 的构建结果推上去。

## 6. 字体与授权

正文、导航、UI 用自托管字体，放在 `docs/stylesheets/fonts/`：

| 用途 | 字体 | 文件 |
| --- | --- | --- |
| 正文、导航、UI | Fira Sans | `fira-sans-latin-300/400/700-normal`、`fira-sans-latin-400/700-italic`、`fira-sans-greek-400-normal/italic` |
| 数学公式 | KaTeX 自带字体 | 由 `katex.min.css` 随 CDN 加载，无需自托管 |

公式用 KaTeX 自己的字体（`KaTeX_Main` / `KaTeX_Math` / `KaTeX_AMS` / `KaTeX_Size1~4` 等），和正文字体互不影响，也不会受 `--md-text-font` 影响。

`docs/stylesheets/fonts/` 里另有一个 `FiraMath-Regular.woff2`，是之前给公式换成 Fira Math 时留下的，**当前未启用**（extra.css 里没有引用它），想改回 Fira Math 公式时可拿来用，不需要就删掉。

两点要知道：

- **Fira Sans 不含中日韩字形**，中文由 [docs/stylesheets/extra.css](docs/stylesheets/extra.css) 里 `--md-text-font` 字体栈中的系统 CJK 字体（PingFang SC / 微软雅黑 / Noto Sans CJK 等）承载，所以中文在不同系统上会略有差异。
- 自托管字体是 **SIL Open Font License 1.1**，允许随站点分发，授权原文在 `docs/stylesheets/fonts/OFL.txt`。替换或删除字体时记得同步维护它。

改字体（正文字体、代码字体、公式字体分别怎么改）都写在 [docs/stylesheets/extra.css](docs/stylesheets/extra.css) 的注释里。

## 7. 常见问题

**`mkdocs: command not found`**
虚拟环境没激活，或依赖没装成功。回到 2.1、2.2 重来。

**`mkdocs build --strict` 报错**
`--strict` 会把所有警告升级为错误。日志里会写明是哪个文件哪一行。若只是链接无法解析之类的警告，可以先去掉 `--strict` 确认能构建，再逐个修。

**公式不渲染**
- 检查是不是写成了 `\(...\)` 或 `\[...\]`——本站配置的是美元符语法
- 检查 `$$` 是不是没独占一行
- 检查 `$` 和公式之间有没有多打空格
- 打开浏览器开发者工具看控制台有没有报错

**公式显示成红色文字**
KaTeX 不认识这个宏，会直接把源码标红。KaTeX 支持的宏比 MathJax 少，`\ce{}`（化学式）这类 MathJax 专有扩展不支持。

**想要自动生成分享卡片（社交图）**
把 `requirements.txt` 换成 `mkdocs-material[imaging]>=9.5`，再取消 `mkdocs.yml` 里 `social` 插件的注释。

**站点样式/资源 404**
`site_url` 没填对，尤其是用了项目仓库（非 `<用户名>.github.io`）的时候。

**改动了文章但线上没更新**
确认改动已经 `git commit` 并 `push`；Actions 的构建结果可以在仓库 **Actions** 标签页查看。