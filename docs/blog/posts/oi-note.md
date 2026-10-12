---
date: 2026-10-12
slug: oi-note
authors:
  - uzxn
categories:
  - 算法竞赛
tags:
  - OI
  - C++
  - 算法
---

# OI 笔记

<a href="#end">转至文末</a>

## 滚动锦标赛排序

```cpp
int winner(int a, int b, vector<int>& nums) {
  if (a == -1) return b;
  if (b == -1) return a;
  if (nums[a] < nums[b]) return a;
  return b;
}

void sort(vector<int>& nums) {
  vector<int> tree, ans;
  tree.reserve(nums.size() * 2 - 1);
  ans.reserve(nums.size());

  for (size_t i = 0; i < nums.size(); i++) tree.push_back(i);

  for (size_t i = 0; i < tree.size() - 1; i += 2)
    tree.push_back(winner(tree[i], tree[i + 1], nums));

  for (size_t i = 0; i < nums.size(); i++) {
    size_t root = tree.back();
    ans.push_back(nums[root]);
    tree[root] = -1;
    while (root < tree.size() - 1) {
      size_t parent = root / 2 + nums.size();
      tree[parent] = winner(tree[root], tree[root ^ 1], nums);
      root = parent;
    }
  }

  nums.assign(ans.begin(), ans.end());
}
```

## 矩阵

```cpp
struct mat {
  ll row, col, data[105][105];  // row 行 col 列
  mat(ll i, ll j) : row(i), col(j) {
    memset(data, 0, sizeof(data));
  }
  ll* operator[](ll i) {
    return data[i];
  }
};

mat operator+(mat a, mat b) {
  for (ll i = 1; i <= a.row; i++) {
    for (ll j = 1; j <= a.col; j++)
      a[i][j] += b[i][j];
  }
  return a;
}

mat operator*(mat a, mat b) {
  mat c(a.row, b.col);
  for (ll i = 1; i <= a.row; i++) {
    for (ll j = 1; j <= b.col; j++) {
      c[i][j] = 0;
      for (ll k = 1; k <= a.col; k++)
        c[i][j] += a[i][k] * b[k][j];
    }
  }
  return c;
}

mat qpow(mat a, ll b) {
  mat c(a.row, a.col);
  for (ll i = 1; i <= a.row; i++)
    c[i][i] = 1;
  for (; b; b >>= 1) {
    if (b & 1) c = c * a;
    a = a * a;
  }
  return c;
}

void print(mat a) {
  for (ll i = 1; i <= a.row; i++) {
    for (ll j = 1; j <= a.col; j++)
      cout << a[i][j] << ' ';
    cout << endl;
  }
}
```

## 二分

![image](https://img2024.cnblogs.com/blog/1965104/202608/1965104-20260810193913659-1012950662.png)

## Miller-Rabin 素性测试

```cpp
bool is_prime(ll n) {
  if (n == 0 || n == 1) return 0;
  if (n == 2 || n == 3) return 1;
  if (n % 2 == 0) return 0;  // 除了 2 的偶数
  ll u = n - 1, t = 0;
  while (n % 2 == 0) n >>= 1, t++;
  ll primes[] = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}; // 前 12 个素数
  for (ll prime : primes) {
    ll v = qpow(prime, u, n);
    if (v == 0 || v == 1 || v == n - 1) continue;
    for (ll i = 1; i <= t; i++) {
      v = v * v % n;
      if (v == 1) return 0;
      if (v == n - 1 && i < t) {
        v = 1;
        break;
      }
    }
    if (v != 1) return 0;
  }
  return 1;
}
```

## 字符串双模哈希

[P11276 第一首歌](https://www.luogu.com.cn/problem/P11276)

| Base  |   Mod    |
| :---: | :------: |
| $137$ | $10^9+7$ |
| $139$ | $10^9+9$ |

```cpp
struct Hash {
  ll base, mod, p[N], hs[N];
  Hash(ll b, ll n, ll m) {
    base = b, mod = m, p[0] = 1;
    for (ll i = 1; i <= n; i++) p[i] = p[i - 1] * base % mod;
  }
  void make(string s) {
    ll n = s.size();
    s = '0' + s, hs[0] = 0;
    for (ll i = 1; i <= n; i++) hs[i] = (hs[i - 1] * base % mod + s[i]) % mod;
  }
  ll get(ll l, ll r) {
    return (hs[r] + mod - hs[l - 1] * p[r - l + 1] % mod) % mod;
  }
} hs1(137, 1e6, 1e9 + 7), hs2(139, 1e6, 1e9 + 9);
```

## 浮点数二分

使用常规的 `while (l + eps < r)` 可能会造成死循环，此时可采取如下的写法

```cpp
for (int i = 1; i <= 1000; i++) {
  mid = (l + r) / 2.0;
  check(mid) ? l = mid : r = mid;
}
```

手动设置二分次数，不会出现死循环，最终答案区间长度缩小到原来的 $\frac{1}{2^{1000}}$。

## 生成随机数

生成 $[n,m]$ 内的随机整数。

```cpp
random_device rd;
mt19937 gen(rd());
ll random(ll n, ll m) { // [n, m]
  uniform_int_distribution<ll> dist(n, m);
  return dist(gen);
}
```

## LCA

```cpp
const ll N = 5e5 + 5;

struct Edge {
  ll f, t, nxt;
} edge[N * 2];

ll cnt, head[N];
void add_edge(ll f, ll t) {
  cnt++;
  edge[cnt] = {f, t, head[f]};
  head[f] = cnt;
}

ll fa[N];
ll getf(ll x) {
  return x == fa[x] ? x : fa[x] = getf(fa[x]);
}

struct query {
  ll node, id;
  query(ll n, ll i) {node = n, id = i;}
};

ll n, m, s, ans[N];
vector<query> q[N];

bool vis[N];
void tarjan(ll u) {
  vis[u] = true;
  for (ll i = head[u]; i; i = edge[i].nxt) {
    ll v = edge[i].t;
    if (!vis[v]) {
      tarjan(v);
      fa[v] = u;
    }
  }
  for (auto i : q[u]) {
    ll node = i.node, id = i.id;
    if (vis[node]) ans[id] = getf(node);
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);
  cin >> n >> m >> s;
  for (ll i = 1; i <= n; i++) fa[i] = i;
  for (ll i = 1; i < n; i++) {
    ll x, y;
    cin >> x >> y;
    add_edge(x, y);
    add_edge(y, x);
  }
  for (ll i = 1; i <= m; i++) {
    ll a, b;
    cin >> a >> b;
    q[a].push_back(query(b, i));
    q[b].push_back(query(a, i));
  }
  tarjan(s);
  for (ll i = 1; i <= m; i++) cout << ans[i] << endl;
  return 0;
}
```

## 欧拉路径

- 欧拉回路：通过图中每条边恰好一次的回路。

- 欧拉通路：通过图中每条边恰好一次的通路。

- 欧拉图：具有欧拉回路的图。

- 半欧拉图：具有欧拉通路但不具有欧拉回路的图。

无向图是欧拉图当且仅当：非零度顶点是连通的；顶点的度数都是偶数。

无向图是半欧拉图当且仅当：非零度顶点是连通的；恰有 2 个奇度顶点。

有向图是欧拉图当且仅当：非零度顶点是强连通的；每个顶点的入度和出度相等。

有向图是半欧拉图当且仅当：非零度顶点是弱连通的；恰有一个顶点的出度与入度之差为 1；恰有一个顶点的入度与出度之差为 1；其他顶点的入度和出度相等。

```cpp
void dfs(ll u) {
  for (ll &i = h[u]; i; i = e[i].nxt) {
    if (e[i].v) {
      e[i].v = 0;
      dfs(e[i].t);
    }
    if (!i) break;
  }
  st[++tp] = u;
}
```

## 判断二分图

```cpp
const ll N = 1e5 + 5, M = 2e5 + 5;

struct Edge {
  ll v, nxt;
} edge[M];

ll cnt;
void add(ll f, ll t) {
  cnt++;
  edge[cnt] = {t, head[f]};
  head[f] = cnt;
}

ll color[N];
bool dfs(ll u, ll c) {
  color[u] = c;
  for (ll i = head[u]; i; i = edge[i].nxt) {
    ll v = edge[i].v;
    if (!color[v]) { // 如果 color 为空 (没有染色)
      if (dfs(v, 3 - c)) return true; // 有奇环
    } else {
      if (color[v] == c) return true; // 有奇环
    }
  }
  return false;
}

int main(void) {
  cin >> n >> m;
  for (ll i = 1; i <= m; i++) {
    ll a, b;
    cin >> a >> b;
    add(a, b);
    add(b, a);
  }
  bool flag = false;
  for(ll i = 1; i <= n; i++) {
    if (!color[i]) {
      if (dfs(u, 1)) {
        flag = true;
        break;
      }
    }
  }
  if (flag) cout << "NO";
  else cout << "YES";
  return 0;
}
```

## 二分图最大匹配

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 505, M = 50005;
ll n, m, e, ans;
ll head[N], cnt, match[N];
bool vis[N];
struct Edge {
  ll v, nxt;
} edge[M];
void add(ll f, ll t) {
  cnt++;
  edge[cnt] = {t, head[f]};
  head[f] = cnt;
}
bool dfs(ll u) {
  for (ll i = head[u]; i; i = edge[i].nxt) {
    ll v = edge[i].v;
    if (vis[v]) continue;
    vis[v] = 1;
    if (!match[v] || dfs(match[v])) {
      match[v] = u;
      return true;
    }
  }
  return false;
}
int main(void) {
  cin >> n >> m >> e;
  for (ll i = 1; i <= e; i++) {
    ll u, v;
    cin >> u >> v;
    add(u, v);
  }
  for (ll i = 1; i <= n; i++) {
    memset(vis, 0, sizeof(vis));
    if (dfs(i)) ans++;
  }
  cout << ans;
  return 0;
}
```

## priority_queue

priority_queue 默认是**大根堆**（堆顶为最大元素）。

**小根堆**请使用 greater：`priority_queue<ll, vector<ll>, greater<ll>> q;`

或重新定义比较函数：

```cpp
struct compare {
  bool operator()(int a, int b) { return a > b; } // 这里定义了小根堆
};
priority_queue<int, vector<int>, compare> q_min;
```

- `empty()`：检查队列是否为空。
- `size()`：返回队列中的元素数量。
- `top()`：返回队列顶部的元素（不删除它）。
- `push()`：向队列添加一个元素。
- `pop()`：移除队列顶部的元素。

## 取模和逆元

当 $p$ 为质数时，$\text{inv}(b) = b^{p-2} \bmod p$。

```cpp
(a + b) % mod = ((a % mod) + (b % mod)) % mod
(a * b) % mod = ((a % mod) * (b % mod)) % mod
(a - b) % mod = ((a % mod) - (b % mod) + mod) % mod
(a / b) % mod = ((a % mod) * (inv(b) % mod)) % mod
```

## 快速斐波那契

数学原理。$O(\log_2 n)$，常数略小于矩阵乘法。

```cpp
map<ll, ll> ff;
ll f(ll x) {
  if (x == 1 || x == 2) return 1;
  if (ff[x]) return ff[x];
  ll t = x >> 1, a, b;
  if (x & 1) {
    a = f(t), b = f(t + 1);
    return ff[x] = a * a + b * b;
  } else {
    a = f(t), b = f(t - 1);
    return ff[x] = ((b << 1) + a) * a;
  }
}
```

## 并查集

```cpp
// 初始化: 将所有节点的根节点设为自身
void init(void) { for (ll i = 1; i <= n; i++) f[i] = i; }
// 找根节点 (路径压缩)
ll getf(ll a) { return f[a] == a ? a : f[a] = getf(f[a]); }
// 合并
void merge(ll a, ll b) { f[getf(b)] = getf(a); }
```

## 快速幂

求 $a^b \bmod p$。

```cpp
ll qpow(ll a, ll b, ll p) {
  ll r = 1;
  while (b) {
    if (b & 1) r = r * a % p;
    a = a * a % p, b >>= 1;
  }
  return r;
}
```

## 树状数组

```cpp
const ll N = 100005;
ll tree[N];
// 1101,0110,0000 => 0000,0010,0000
ll lowbit(ll x) { return x & (-x); }
// 求前 k 个元素和
ll getsum(ll k) {
  ll s = 0;
  while (k > 0) {
    s += tree[k];
    k -= lowbit(k);
  }
  return s;
}
// 将第 i 个元素加 x
void change(ll i, ll x) {
  while (i <= N) {
    tree[i] += x;
    i += lowbit(i);
  }
}
```

## 取整函数

```cpp
double floor(double num); // 向下取整
double  ceil(double num); // 向上取整
double round(double num); // 四舍五入
```

## 类型大全

```cpp
         short min = -32768
         short max =  32767
unsigned short max =  65535

         int min = -2147483648
         int max =  2147483647
unsigned int max =  4294967295

         long min = -9223372036854775808
         long max =  9223372036854775807
unsigned long max =  18446744073709551615

         long long min = -9223372036854775808
         long long max =  9223372036854775807
unsigned long long max =  18446744073709551615

  sizeof(char)    =  8
         char min = -128
         char max =  127
  signed char min = -128
  signed char max =  127
unsigned char max =  255
```

## 纯手写 48 位高精度

最高十进制 48 位，即最大可存储 $10^{48}-1$。

```cpp
constexpr ll E16 = 1e16;
struct ull {
  ll h, m, l;
  friend ull operator+(ull a, ll b) {
    a.m += (b + a.l) / E16;
    a.l = (b + a.l) % E16;
    return a;
  }
  friend ull operator+(ull a, ull b) {
    a.m += (b.l + a.l) / E16;
    a.l = (b.l + a.l) % E16;
    a.h += (b.m + a.m) / E16;
    a.m = (b.m + a.m) % E16;
    a.h = (b.h + a.h) % E16;
    return a;
  }
};
ull read(void) {
  string s;
  cin >> s;
  ll h = 0, m = 0, l = 0, n = s.size(), i = 0;
  if (n > 32 && n <= 48) while (i < n - 32) h = h * 10 + s[i++] - '0';
  if (n > 16 && n <= 48) while (i < n - 16) m = m * 10 + s[i++] - '0';
  if (n > 0 && n <= 48) while (i < n) l = l * 10 + s[i++] - '0';
  ull a = {h, m, l};
  return a;
}
void write(ull a) {
  if (a.h > 0) printf("%lld%016lld%016lld", a.h, a.m, a.l);
  else if (a.m > 0) printf("%lld%016lld", a.m, a.l);
  else if (a.l > 0) printf("%lld", a.l);
}
```

## 普通快读

```cpp
ll read(void) {
  ll n = 0;
  bool f = 1;
  char c = getchar();
  while (!isdigit(c)) {
    c == '-' && (f = 0);
    c = getchar();
  }
  while (isdigit(c)) {
    n = (n << 1) + (n << 3) + (c ^ 48);
    c = getchar();
  }
  return f ? n : ~n + 1;
}
```

```cpp
ll read(void) {
  ll n = 0;
  bool f = 1;
  char c = getchar();
  for (; !isdigit(c); c = getchar()) c == '-' && (f = 0);
  for (; isdigit(c); c = getchar()) n = (n << 1) + (n << 3) + (c ^ 48);
  return f ? n : ~n + 1;
}
```

## 逆天快读

```cpp
#include <ctype.h>
#include <stdio.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <unistd.h>
typedef long long ll;

bool _f;
char *_c;
struct stat _s;
void read(ll *v) {
  *v = 0, _f = 0;
  while (!isdigit(*_c)) *_c++ == '-' && (_f = 1);
  while (isdigit(*_c)) *v = (*v << 1) + (*v << 3) + (*_c++ ^ 48);
  _f && (*v = ~*v + 1);
}

ll n, A, B;

main() {
  fstat(0, &_s);
  _c = (char *)mmap(0, _s.st_size, 1, 2, 0, 0);

  read(&A);
  read(&B);
  printf("%lld", A + B);
}
```

## 高精度

```cpp
struct N { ll v[999]; };
// 大于
bool operator>(const N& a, const N& b) {
  if (a.v[0] > b.v[0]) return 1;
  if (a.v[0] < b.v[0]) return 0;
  for (int i = a.v[0]; i > 0; i--) {
    if (a.v[i] > b.v[i]) return 1;
    if (a.v[i] < b.v[i]) return 0;
  }
  return 0;
}
// 小于
bool operator<(const N& a, const N& b) {
  if (a.v[0] > b.v[0]) return 0;
  if (a.v[0] < b.v[0]) return 1;
  for (int i = a.v[0]; i > 0; i--) {
    if (a.v[i] > b.v[i]) return 0;
    if (a.v[i] < b.v[i]) return 1;
  }
  return 0;
}
// 等于
bool operator==(const N& a, const N& b) {
  if (a.v[0] != b.v[0]) return 0;
  for (int i = 1; i <= a.v[0]; i++) {
    if (a.v[i] != b.v[i]) return 0;
  }
  return 1;
}
// 大于等于
bool operator>=(const N& a, const N& b) { return !(a < b); }
// 小于等于
bool operator<=(const N& a, const N& b) { return !(a > b); }
// 不等于
bool operator!=(const N& a, const N& b) { return !(a == b); }
// 高精加单精
N operator+(const N& a, ll b) {
  N r = a;
  r.v[1] += b;
  for (int i = 1; i <= r.v[0]; i++) {
    if (r.v[i] > 9999) {
      r.v[i + 1] += r.v[i] / 10000;
      r.v[i] %= 10000;
      if (i == r.v[0]) r.v[0]++;
    }
  }
  return r;
}
// 高精加高精
N operator+(const N& a, const N& b) {
  if (a.v[0] < b.v[0]) return b + a;
  N r = a;
  for (int i = 1; i <= b.v[0]; i++) r.v[i] += b.v[i];
  for (int i = 1; i <= r.v[0]; i++) {
    if (r.v[i] > 9999) {
      r.v[i + 1] += r.v[i] / 10000;
      r.v[i] %= 10000;
      if (i == r.v[0]) r.v[0]++;
    }
  }
  return r;
}
// 高精乘单精
N operator*(const N& a, ll b) {
  N r = a;
  for (int i = 1; i <= r.v[0]; i++) r.v[i] *= b;
  for (int i = 1; i <= r.v[0]; i++) {
    if (r.v[i] > 9999) {
      r.v[i + 1] += r.v[i] / 10000;
      r.v[i] %= 10000;
      if (i == r.v[0]) r.v[0]++;
    }
  }
  return r;
}
// 高精乘高精
N operator*(const N& a, const N& b) {
  if (a.v[0] < b.v[0]) return b * a;
  N r = {{1, 0}};
  for (int i = 1; i <= b.v[0]; i++) {
    for (int j = 1; j <= a.v[0]; j++) {
      r.v[i + j - 1] += a.v[j] * b.v[i];
    }
  }
  for (int i = 1; i <= r.v[0]; i++) {
    if (r.v[i] > 9999) {
      r.v[i + 1] += r.v[i] / 10000;
      r.v[i] %= 10000;
      if (i == r.v[0]) r.v[0]++;
    }
  }
  return r;
}
// 高精输入
N read(void) {
  N r = {{1, 0}};
  string s;
  cin >> s;
  while (s.size() % 4 != 0) s = "0" + s;
  r.v[0] = s.size() / 4;
  for (int i = s.size() - 1, cnt = 1; i > 0; i -= 4) {
    r.v[cnt] = s[i - 3] * 1000 + s[i - 2] * 100;
    r.v[cnt++] += s[i - 1] * 10 + s[i] - 53328;
  }
  return r;
}
// 高精输出
void write(N a) {
  printf("%lld", a.v[a.v[0]]);
  for (int i = a.v[0] - 1; i > 0; i--) {
    printf("%04lld", a.v[i]);
  }
  cout << endl;
}
// 字符串转高精
N str2N(string s) {
  N r = {{1, 0}};
  for (unsigned i = 0; i < s.size(); i++) {
    r = r * 10 + (s[i] - '0');
  }
  return r;
}
```

<div id="end"></div>
