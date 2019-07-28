import React, { Component } from 'react';

class Generator extends Component {


	/**
	 * Has the button for making the palette
	 *
	 * @param {object} props
	 * @param {Function} props.onClick
	 */
	constructor(props) {
		super(props);

		this.handleButtonClick = this.handleButtonClick.bind(this);
	}

	handleButtonClick() {
		this.props.onClick();
	}

	//

	render () {
		const innerText = (
			this.props.hasPalette ?
				'Another!' :
				'Make me a palette'
		);

		return (
			<div className="Generator">
				<button
					onClick={this.handleButtonClick}
				>{innerText}</button>
			</div>
		);
	}
}

export default Generator;


