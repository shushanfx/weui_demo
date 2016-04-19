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