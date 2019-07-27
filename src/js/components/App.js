import React, { Component, } from 'react';

import Adder from './Adder.js';
import Palette from './Palette.js';
import Seeds from './Seeds.js';
import Color from './../Color.js'

// todo: import CSS

class App extends Component {

	/**
	 * The BIG holder for ALL the things
	 * Renders right onto the root as you do
	 *
	 * @param {object} props
	 */
	constructor(props) {
		super(props);

		this.state = {
			'colors': [],
		};

		this.addColor = this.addColor.bind(this);
		this.removeColor = this.removeColor.bind(this);
	}

	/**
	 * Add a color to this state, via object
	 *
	 * Comparison is by hex string
	 *
	 * It will not add duplicates;
	 * Returns whether or not color was added
	 *
	 * @param {Color} addingColor
	 * @returns {boolean}
	 */
	addColor (addingColor) {
		var i;
		const ilen = this.state.colors.length;

		for (i = 0; i < ilen; i++) {
			if (addingColor.getHexString() === this.state.colors[i].getHexString()) {
				return false;
			}
		}

		const colors = this.state.colors.concat(addingColor);

		this.setState({
			'colors': colors,
		});

		return true;
	}


	/**
	 * Remove a color from this state, via object
	 *
	 * Comparison is by hex string
	 *
	 * It will not remove anything from the state if not matched
	 * Returns whether a color was matched & removed
	 * Will not remove more than one color
	 *
	 * @param {Color} removingColor
	 * @returns {boolean}
	 */
	removeColor(removingColor) {
		let colors = this.state.colors.slice();

		var i;
		const ilen = colors.length;

		for (i = 0; i < ilen; i++) {
			if (removingColor.getHexString() === this.state.colors[i].getHexString()) {
				colors.splice(i, 1);

				this.setState({
					'colors': colors,
				});

				return true;
			}
		}

		return false;
	}


	render () {
		return (
			<div className='App'>
				{/* possibly a header here */}

				<Adder
					onAdd={(color) => this.addColor(color)}
				/>

				<Seeds
					colors={this.state.colors}
					onRemove={(color) => this.removeColor(color)}
				/>

				<Palette
					colors={this.state.colors}
				/>
			</div>
		);
	}
}

export default App;


