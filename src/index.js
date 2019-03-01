import _ from 'lodash'
import print from './print.js'

import { sum } from './math'

let arr = ['hello','webpack']
let str = _.join(arr,'')
let btn = document.createElement('button')
print()
btn.className = 'add'
console.log(btn)
console.log(str)

console.log(sum(5))
if(module.hot) {
    module.hot.accept('./print.js',function () {
        console.log('print.js中文件发生变化')
    })
}

if (process.env.NODE_ENV !== 'production') {
    console.log('这是生产环节')
}