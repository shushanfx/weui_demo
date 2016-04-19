# weui_demo
ReactJS，当前流行的前端框架之一，它的火热程度自不必说。下面我们通过nodejs和gulp开发环境。

1. 包的管理（package.json）
```javascript
 "dependencies": {
    "body-parser": "^1.12.3",
    "errorhandler": "^1.3.5",
    "express": "^4.12.3",
    "express-session": "^1.11.1",
    "jade": "^1.9.2",
    "merge": "^1.2.0",
    "method-override": "^2.3.2",
    "morgan": "^1.5.2",
    "multer": "^0.1.8",
    "serve-favicon": "^2.2.0"
  },
  "devDependencies": {
    "babelify": "^7.2.0",
    "browserify": "^13.0.0",
    "del": "^2.2.0",
    "gulp": "^3.9.1",
    "gulp-streamify": "^1.0.2",
    "gulp-uglify": "^1.5.3",
    "gulp-watch": "^4.3.5",
    "minify": "^2.0.6",
    "react": "^0.14.8",
    "react-dom": "^0.14.8",
    "react-weui": "^0.3.0",
    "reactify": "^1.1.1",
    "vinyl-source-stream": "^1.1.0"
  }
````
2. gulp配置
````javascript
gulp.task('view_compile', ['view_clean'], function() {
  // Browserify/bundle the JS.
  var list = fs.readdirSync(baseDir);
  
  list.forEach(function(value) {
      var newDir = path.join(baseDir, value , "/index.js");
      var isExist = fs.existsSync(newDir);
      if(isExist){
            browserify(newDir)
            .transform(reactify)
            .transform(babelify)
            .bundle()
            .pipe(source(value + ".js"))
            // .pipe(streamify(uglify()))
            .pipe(gulp.dest(baseDest));    
      }
  });
});
````javascript
编译baseDir下所有文件，并且每个文件夹均按照 dirName/index.js作为入口，如 baseDir/index/index.js；

* 定义watch的task：
````javascript
// Rerun tasks whenever a file changes.
gulp.task('watch', function() {
    watch([path.join(baseDir, "**/*.js"), path.join(baseDir + "**/*.jsx")], function(eventObject){
        var str = path.join(eventObject.cwd, baseDir);
        var realName = str;
        var iCount = 0;
        str = eventObject.path.replace(str, ""); 
        realName = str.split(path.sep);
        while(iCount < realName && !realName[iCount]){
            iCount ++;
        }
        realName = realName[iCount];
        gutil.log(eventObject.path + " has changed...");
        registerTimer(realName);
    });
});
````

3. express配置,server.js
````javascript
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 18082);
app.set('views', path.join(__dirname, 'jade'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'static/favicon.ico')));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'static')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
````
指定了静态路径为static目录。

4. bower安装static依赖

* 配置.bowerrc文件
````javascript
{
    "directory": "static/plugin"
}
````

* 配置bower.json
````javascript
  "dependencies": {
    "weui": "~0.4.1"
  }
````

5. 启动 `npm start`
6. 截图

7. 核心代码：
* src/view/index/index.js
````javascript
/** @jsx React.DOM, wi */
var ReactDOM = require('react-dom');  // Browserify!
var React = require("react");
var WeUI = require("react-weui");
var {Button, Cells, Cell, Dialog, CellHeader, CellBody, ActionSheet, Page} = WeUI;

var HelloMessage = React.createClass({  // Create a component, HelloMessage.
    getInitialState: function(){
        return {
            count: 0,
            dialogShow: false,
            sheetShow: false,    
        }; 
    },
    getDefaultProps : function(){
        return {};        
    },
      render: function() {
        return (<div title="Test" style={{margin: "15px 7px"}}>
                    <h1 style={{"textAlign": "center", "marginBottom": "10px"}}>React Demo</h1>
                    <Button ref="btnAdd" onClick={this.click}>自增{this.state.count}</Button>
                    <Button type="primary" onClick={this.onHandleDialog.bind(this, true)}>弹出对话框</Button>
                    <Button type="primary" onClick={this.onHandleSheet.bind(this, true)}>弹出ActionSheet</Button>
                    <Dialog.Alert show={this.state.dialogShow} title="Hello" buttons={[{
                        label: "确定",
                        onClick: this.onHandleDialog.bind(this, false)     
                        }, {
                            label: "取消",
                            onClick: this.onHandleDialog.bind(this, false)     
                        }
                    ]}>
                        <Cell>
                            <CellHeader><label>Name:</label></CellHeader>
                            <CellBody><input defaultValue="123" /></CellBody>
                        </Cell>
                    </Dialog.Alert>
                    <ActionSheet menus={[
                        {
                            label: "抓取",
                            onClick: this.onHandleFetch
                        }
                    ]} actions={[
                        {
                            label: "退出",
                            onClick: this.onHandleSheet.bind(this, false)
                        }
                    ]} show={this.state.sheetShow} onRequestClose={this.onHandleSheet.bind(this, false)} />
                    
                </div>);
      },
      click: function(){
        let count = this.state.count;
        count ++;
        this.setState({
            "count": count
        }); 
      },
      onHandleDialog: function(isHide){
        this.setState({
            dialogShow: isHide
        });
      },
      onHandleSheet: function(isHide){
        this.setState({
            sheetShow: isHide
        });    
      }
});

ReactDOM.render(
    <HelloMessage name="shushanfx" />,
    document.getElementById("container"));
````

* static/demo/index.html
````html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
    <title>Title</title>
    <link href="../plugin/weui/dist/style/weui.min.css" rel="stylesheet">
</head>
<body>
    <div id="container"></div>
    <script type="text/javascript" src="../js/view/index.js"></script>
</body>
</html>
````
> 引入weui的css
> 引入编译后的index.js

8. 代码地址：https://github.com/shushanfx/weui_demo 
