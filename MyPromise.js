//记录Promise的三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  /**
   * 创建一个Promise
   * @param {Function} executor 任务执行器，立即执行
   */
  constructor(executor) {
    this._state = PENDING //状态
    this._value = undefined //数据
    try {
      executor(this._resolve.bind(this), this._reject.bind(this))
    } catch (error) {
      this._reject(error)
    }
  }

  /**
   *更改任务状态
   * @param {String} newState 新状态
   * @param {any} value 相关数据
   */
  _changeState(newState, value) {
    if (this._state !== PENDING) {
      //状态一旦改变，就不能再变
      return
    }
    this._state = newState
    this._value = value
  }

  /**
   *标记当前任务完成
   * @param {any} data 任务完成的相关数据
   */
  _resolve(data) {
    //改变状态和数据
    this._changeState(FULFILLED, data)
  }
  /**
   *标记当前任务失败
   * @param {any} reason 任务失败的相关数据
   */
  _reject(reason) {
    //改变状态和数据
    this._changeState(REJECTED, reason)
  }
}

const pro = new MyPromise((resolve, reject) => {
  throw 111
})

console.log(pro)
