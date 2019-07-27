import React, { Component } from 'react';

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
		return <li
			key={color.getHexString()}
			onClick={() => this.props.onRemove(color)}
		>{color.getHexString()}</li>
	}

	render () {
		const listItems = this.props.colors.map((color) => {
			return this.renderColor(color);
		});

		return (
			<div className="Seeds">
				<ul>
					{listItems}
				</ul>
			</div>
		);
	}
}

export default Seeds;


