import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Button extends React.Component {
	state = { counter: 0 };

	render() {
		return (
			<button>
				{ this.state.counter }
			</button>
		);
	}
}

ReactDOM.render(<Button />, document.getElementById('root'));