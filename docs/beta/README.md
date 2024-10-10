---
tags: []
created: '2024-06-11'
title: '2024-06-11T14:41_欧拉公式'
---

欧拉公式（Euler's formula）是复分析中的一个重要公式，由瑞士数学家莱昂哈德·欧拉（Leonhard Euler）在18世纪提出。这个公式揭示了复数指数函数与三角函数之间的深刻联系，其形式为：

$$
e^{ix} = \cos(x) + i\sin(x)
$$

其中：
- $e$ 是自然对数的底（约为2.71828）。
- $i$ 是虚数单位，满足 $i^2 = -1$。
- $x$ 是实数。

这个公式可以通过多种方法推导出来，包括泰勒级数展开法和微分方程法。下面我会详细解释这两种推导方法。

### 1. 泰勒级数展开法

泰勒级数是一种将函数表示为无穷级数的方法。对于指数函数 $e^{ix}$、余弦函数 $\cos(x)$ 和正弦函数 $\sin(x)$，它们的泰勒级数分别为：

$$
e^{ix} = \sum_{n=0}^{\infty} \frac{(ix)^n}{n!}
$$

$$
\cos(x) = \sum_{n=0}^{\infty} \frac{(-1)^n x^{2n}}{(2n)!}
$$

$$
\sin(x) = \sum_{n=0}^{\infty} \frac{(-1)^n x^{2n+1}}{(2n+1)!}
$$

将 $e^{ix}$ 的泰勒级数展开：

$$
e^{ix} = 1 + ix + \frac{(ix)^2}{2!} + \frac{(ix)^3}{3!} + \frac{(ix)^4}{4!} + \cdots
$$

$$
= 1 + ix + \frac{i^2 x^2}{2!} + \frac{i^3 x^3}{3!} + \frac{i^4 x^4}{4!} + \cdots
$$

由于 $i^2 = -1$， $i^3 = -i$， $i^4 = 1$ 等，可以进一步简化：

$$
= 1 + ix - \frac{x^2}{2!} - \frac{ix^3}{3!} + \frac{x^4}{4!} + \cdots
$$

将实部和虚部分开：

$$
= \left(1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \cdots \right) + i\left(x - \frac{x^3}{3!} + \frac{x^5}{5!} - \cdots \right)
$$

观察到这些分别是余弦函数和正弦函数的泰勒级数：

$$
e^{ix} = \cos(x) + i\sin(x)
$$

### 2. 微分方程法

考虑复指数函数 $f(x) = e^{ix}$，我们知道它满足以下微分方程：

$$
f'(x) = i e^{ix} = if(x)
$$

假设 $f(x) = \cos(x) + i\sin(x)$，则：

$$
f'(x) = -\sin(x) + i\cos(x)
$$

比较两边，我们看到：

$$
i(\cos(x) + i\sin(x)) = -\sin(x) + i\cos(x)
$$

将右边展开：

$$
i\cos(x) - \sin(x) + i^2 \sin(x) = -\sin(x) + i\cos(x)
$$

因为 $i^2 = -1$，所以 $i^2 \sin(x) = -\sin(x)$，这两个表达式相等。因此，

$$
e^{ix} = \cos(x) + i\sin(x)
$$

### 欧拉公式的几何解释

欧拉公式在复平面上有一个重要的几何解释。考虑复平面上的一个点，其极坐标表示为 $re^{i\theta}$，其中 $r$ 是模长，$\theta$ 是辐角。根据欧拉公式，这个点的笛卡尔坐标表示为：

$$
(r\cos(\theta), r\sin(\theta))
$$

因此，复数 $e^{ix}$ 可以看作是一个单位圆上的点，其角度为 $x$ 弧度。

### 欧拉恒等式

欧拉公式在 $x = \pi$ 时，得到著名的欧拉恒等式：

$$
e^{i\pi} + 1 = 0
$$

这被认为是数学中最美丽的公式之一，因为它将五个最重要的数学常数 $e, i, \pi, 1, 0$ 通过简单的关系连接在一起。

欧拉公式不仅在纯数学中有重要应用，也在物理学、电工程学和其他工程领域中具有广泛的应用。它为许多复杂问题提供了简洁而强大的工具。