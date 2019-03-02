import _ from 'lodash'
import './style.css';
import google from './google.svg'

import printMe from './print.js'
function component() {
    var element = document.createElement('div')
    var btn = document.createElement('button')

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello')

    btn.innerHTML = '点击我'
    btn.onclick = printMe

    
    var myImg = new Image()
    myImg.src = google
    element.appendChild(myImg)
    element.appendChild(btn)
    return element
}
let element = component(); // 当 print.js 改变导致页面重新渲染时，重新获取渲染的元素
document.body.appendChild(element);

if(module.hot) {
    module.hot.accept('./print.js',function () {
        console.log('print中的文件发生变化')
        document.body.removeChild(element);
        element = component(); // 重新渲染页面后，component 更新 click 事件处理
        document.body.appendChild(element);
    })
}