import React, { Component } from 'react';
import Color from '../Color';

class Adder extends Component {


	constructor(props) {
		super(props);

		this.state = {
			'inputValue': '',
		};

		this.handleButtonClick = this.handleButtonClick.bind(this);
		this.handleInputUpdate = this.handleInputUpdate.bind(this);
	}

	getColorObject(text) {
		try {
			return new Color(text);
		} catch (e) {
			// todo: handle
		}

		return null;
	}

	handleInputUpdate(event) {
		this.setState({
			'inputValue': event.target.value,
		});
	}

	handleButtonClick() {
		const color = this.getColorObject(this.state.inputValue);
		if (color) {
			this.props.onAdd(color);
		}
	}

	render () {
		return (
			<div className="Adder">
				<input
					type="text"
					value={this.state.inputValue}
					onChange={this.handleInputUpdate}
				/>

				<button
					onClick={this.handleButtonClick}
				>Add</button>
			</div>
		);
	}
}

export default Adder;


