import React, { Component } from 'react';

import Chip from './Chip.js';

class Palette extends Component {


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
		if (!this.props.colors.length) {
			return (
				<div className="Palette">
					<p>Nothing here yet</p>
					<p>Add something and make it</p>
				</div>
			)
		}

		const listItems = this.props.colors.map((color) => {
			return this.renderColor(color);
		});

		return (
			<div className="Palette chip-grid">
				{listItems}
			</div>
		);
	}
}

export default Palette;


