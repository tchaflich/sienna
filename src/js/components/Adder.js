import React, { Component } from 'react';
import Color from '../Color';

class Adder extends Component {


	constructor(props) {
		super(props);

		this.state = {
			'inputValue': '',
			'lastColor': null,
		};

		this.handleButtonClick = this.handleButtonClick.bind(this);
		this.handleInputUpdate = this.handleInputUpdate.bind(this);
		this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
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

	handleInputKeyDown(event) {
		if (event.keyCode === 13) {
			try {
				const color = this.getColorObject(this.state.inputValue);
				this.addColor(color);
			} catch (e) {
				// shrug for now
			}
		}
	}

	handleButtonClick() {
		const color = this.getColorObject(this.state.inputValue);
		if (color) {
			this.addColor(color);
		}
	}

	addColor(color) {
		this.setState({
			'inputValue': '',
			'lastColor': color,
		});
		this.props.onAdd(color);
	}

	render () {
		let color;
		try {
			color = this.getColorObject(this.state.inputValue);
		} catch (e) {
			color = null;
		}

		if (!color && this.state.lastColor) {
			color = this.state.lastColor;
		}

		let illumination = null;
		if (color && color.getRelativeLuminance() > 0.6) {
			illumination = 'dark';
		} else {
			illumination = 'light';
		}

		const styles = {
			'backgroundColor': color ? color.getHexString() : null,
		};

		return (
			<div className="Adder">
				<input
					type="text"
					placeholder="#c0ffee, #7ea, etc"
					className={illumination}
					value={this.state.inputValue}
					onChange={this.handleInputUpdate}
					onKeyDown={this.handleInputKeyDown}
				/>

				<button
					style={styles}
					className={illumination}
					onClick={this.handleButtonClick}
				>Add</button>
			</div>
		);
	}
}

export default Adder;


