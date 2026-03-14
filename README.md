# handwrite-Promise

一个基于 **Promise/A+ 思路** 的 `Promise` 手写实现练习项目。  
核心目标：理解异步状态流转、链式调用、微任务调度与常见静态方法实现。

---

## 项目结构

```text
handwrite-Promise/
├─ index.html
├─ MyPromise.js
└─ README.md
```

---

## 已实现能力

`MyPromise.js` 当前包含以下能力：

### 实例能力

- `then(onFulfilled, onRejected)`
	- 支持链式调用
	- 回调结果支持普通值与 Promise-like（有 `then`）
- `catch(onRejected)`
	- `then(null, onRejected)` 语法糖
- `finally(onSettled)`
	- 无论成功/失败都会执行
	- 保留原有成功值或失败原因继续向后传递

### 静态能力

- `MyPromise.resolve(data)`
- `MyPromise.reject(reason)`
- `MyPromise.all(proms)`
- `MyPromise.allSettled(proms)`
- `MyPromise.race(proms)`

### 运行机制要点

- 内部状态：`pending` / `fulfilled` / `rejected`
- 状态一旦变更不可逆
- 通过处理队列 `_handlers` 保存 `then` 注册的回调
- 使用 `runMicroTask` 尽量模拟微任务（优先级：`process.nextTick` → `MutationObserver` → `setTimeout`）

---

## 使用方式

在浏览器中直接引入 `MyPromise.js`，或在控制台中运行文件进行观察。

### 基础示例

```js
const p = new MyPromise((resolve, reject) => {
	setTimeout(() => resolve('ok'), 500)
})

p.then((res) => {
	console.log('成功：', res)
	return 'next value'
})
	.then((v) => {
		console.log('链式结果：', v)
	})
	.catch((err) => {
		console.error('失败：', err)
	})
	.finally(() => {
		console.log('finally 执行')
	})
```

### `all` 示例

```js
MyPromise.all([
	MyPromise.resolve(1),
	new MyPromise((resolve) => setTimeout(() => resolve(2), 300)),
	3,
]).then((list) => {
	console.log(list) // [1, 2, 3]
})
```

### `race` 示例

```js
MyPromise.race([
	new MyPromise((resolve) => setTimeout(() => resolve('A'), 500)),
	new MyPromise((resolve) => setTimeout(() => resolve('B'), 100)),
]).then((winner) => {
	console.log(winner) // B
})
```

---

## 当前代码中的演示

`MyPromise.js` 文件末尾自带了一个简单测试：

- 创建 `pro`（1 秒后 resolve）
- `pro2 = pro.then()`
- 1.5 秒后输出 `pro` 与 `pro2`，可观察状态变化与透传行为

---

## 与原生 Promise 的差异（学习版说明）

这是一个教学/练习实现，不是完整工业级 polyfill。与原生实现相比可能有差异，例如：

- 边界行为与规范细节未做 100% 对齐
- 诊断能力（如未处理 rejection 提示）较简化
- 非法 thenable、循环引用等极端场景可继续增强

如果你的目标是“彻底对齐规范”，建议继续补充 `Promise Resolution Procedure` 的完整边界分支与测试用例。

---

## 学习建议

1. 先阅读 `constructor`、`_changeState`、`then`。
2. 重点理解：
	 - 为什么要维护回调队列
	 - 为什么回调需要异步（微任务）执行
	 - 为什么 `then` 必须返回新 Promise
3. 再逐步实现并验证 `all / race / allSettled`。

---

## License

仅用于学习交流。
