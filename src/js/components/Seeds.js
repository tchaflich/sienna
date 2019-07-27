import React, { Component } from 'react';

import Chip from './Chip.js';

class Seeds extends Component {

	/**
	 * List of seed colors
	 *
	 * @param {object} props
	 * @param {Array<Color>} props.colors
	 */
	constructor(props) {
		super(props);
	}

	renderColor (color) {
		return <Chip
			key={color.getHexString()}
			color={color}
		/>
	}

	render () {
		const listItems = this.props.colors.map((color) => {
			return this.renderColor(color);
		});

		return (
			<div className="Seeds chip-grid">
				{listItems}
			</div>
		);
	}
}

export default Seeds;


