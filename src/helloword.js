/**
 * Created by xfeng on 2016/1/5.
 */

var MyComponent = React.createClass({
    render: function () {
        return (
            <h1>Hello, {this.props.name}!</h1>
        );
    }
});

ReactDOM.render(<MyComponent name="Handsome"/>, document.getElementById('example'));