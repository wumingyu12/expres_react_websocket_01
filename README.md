express为后台，react作为前端，socketio作为通信
==========================================

1.这个项目如何新建出来
----------------------
*mkdir express_react_websocket_01*

*cd express_react_websocket_01*

*npm init*

*npm install express --save*

2.如何写一个express的HelloWorld
---------------
1.新建一个index.js

2.敲入代码
```javascript
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
```

3.*node index.js* 并打开127.0.0.1:3000查看

参考[express中文官方网](http://www.expressjs.com.cn/)

3.如何需要在访问express时返回的是一个react显示的页面
-----------------------------------------------------
### 3.1 安装webpack和react [参考](https://www.twilio.com/blog/2015/08/setting-up-react-for-es6-with-webpack-and-babel-2.html)
```shell
npm install --save react@0.14.7
npm install --save react-dom@0.14.7
npm install --save-dev webpack@1.12.12
```
为了可以将es6转为es5安装babel,我们不用babel6 babel6在webpack里面的引入和babel5是不同的
```shell
npm install --save-dev babel-core@5.8.25
npm install --save-dev babel-loader@5.3.2	
```

### 3.2 创建react的组件
* 在根目录下创建 */views/react_component/01_helloWorld* 
* 在*/views/react_component* 里面创建react组件 *hello.js* 这个简单的组件只是用来简单的输出"Hello"
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
 
class Hello extends React.Component {
  render() {
    return <h1>Hello</h1>
  }
}

ReactDOM.render(<Hello/>, document.getElementById('hello'));
```
* 同样我们再创建一个组件 *world.js* 只是用来输出“world”
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
 
class World extends React.Component {
  render() {
    return <h1>World</h1>
  }
}
 
ReactDOM.render(<World/>, document.getElementById('world'));
```
* 现在我们有两个组件，我们创建一个webpack用的入口，“helloWorld_main.js”
```javascript
import Hello from './hello.js';
import World from './world.js';
```

### 3.3 创建的组件并不能被浏览器直接使用，用webpack处理生成浏览器可用的js
* 返回到根目录 创建 *webpack.config.js* 因为上面我们用js结尾的文件，webpack的加载器也是加载js的
```javascript
var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: './views/react_component/01_helloWorld/helloWorld_main.js',
  output: { path: __dirname, filename: './views/output/01_helloWorld/bundle.js' },
  module: {
    loaders: [
        { test: /\.js?$/, loaders: ['babel'], exclude: /node_modules/ },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
        { test: /\.css$/, loader: "style!css" },
        {test: /\.less/,loader: 'style-loader!css-loader!less-loader'}
    ]
  },
};
```
运行 *webpack* 可以在 ./views/output/01_helloWorld/看到bundle.js

### 3.4 创建一个html文件用来使用编译后的bundle.js
* 在./views/output/01_helloWorld下面新建helloworld.html
```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello React</title>
  </head>
  <body>
    <div id="hello"></div>
    <div id="world"></div>
    <script src="./bundle.js"></script>
  </body>
</html>
```
直接打开helloworld.html 可以看到react用js渲染的hello world

### 3.5 添加路由可以在express服务端打开需要的页面
参考 [利用 Express 托管静态文件](http://www.expressjs.com.cn/starter/static-files.html)

* 在上面express的index.js中第三行加入,将01_helloWorld静态文件映射为helloworld
```javascript
	app.use('/helloworld', express.static('views/output/01_helloWorld'));
```

* http://127.0.0.1:3000/helloworld/helloworld.html 进入查看和直接打开查看一样

### 3.6 增加一个自动化脚本
上面我们需要运行 *webpack* 来编译react，运行 *node index.js* 来启动exprss服务，我们可以合并在一个脚本使用

修改package.json

```javascript
  "scripts": {
    "start":"webpack && node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
以后我们只要运行 npm start就让脚本自动编译并启动服务

## 4.使用git做版本管理
使用git需要让git忽略一些文档的变化

* 用gitbash创建.gitignore文件 *touch .gitignore* 

忽略node_modules文件夹，忽略webpack生成的bundle.js文件

```javascript
node_modules/
bundle.js
```