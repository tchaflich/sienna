import React, { Component } from 'react';

import Adder from './Adder.js';
import Palette from './Palette.js';
import Seeds from './Seeds.js';
import Generator from './Generator.js';

import Color from './../Color.js';
import Mixer from './../Mixer.js';

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
			'palette': [],
		};

		this.addColor = this.addColor.bind(this);
		this.removeColor = this.removeColor.bind(this);
		this.generatePalette = this.generatePalette.bind(this);
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

	generateShade(color) {
		const oldValue = color.getValue();
		if (oldValue > 25) {
			return new Color({
				'hue': color.getHue(),
				'saturation': Mixer.clamp(color.getSaturation() + 5, 0, 100),
				'value': color.getValue() - 20,
			});
		}

		return new Color({
			'hue': color.getHue(),
			'saturation': Mixer.clamp(color.getSaturation() - 20, 0, 100),
			'value': Mixer.clamp(color.getValue() - 20, 0, 100),
		});
	}

	generateTint(color) {
		const oldValue = color.getValue();
		if (oldValue < 75) {
			return new Color({
				'hue': color.getHue(),
				'saturation': Mixer.clamp(color.getSaturation() - 5, 0, 100),
				'value': color.getValue() + 20,
			});
		}

		return new Color({
			'hue': color.getHue(),
			'saturation': Mixer.clamp(color.getSaturation() + 20, 0, 100),
			'value': Mixer.clamp(color.getValue() + 20, 0, 100),
		});
	}

	hasGrey(colorArray) {
		var i;
		const ilen = colorArray.length;

		for (i = 0; i < ilen; i++) {
			if (colorArray[i].getSaturation() < 10) {
				return true;
			}
		}

		return false;
	}

	generatePalette() {
		const mainSetMaximum = 10; // magic number, personal taste
		const colors = this.state.colors.slice();
		const mixer = new Mixer(colors);

		let mainSet = [].concat(
			mixer.shuffleArray(colors.slice())
				.slice(0, Math.floor(mainSetMaximum / 2))
		);

		let checkAddGenerated = (color) => {
			var i;
			const ilen = mainSet.length;

			for (i = 0; i < ilen; i++) {
				// if it's already in the list, do not re-add
				if (color.getHexString() === mainSet[i].getHexString()) {
					return false;
				}

				// avoid having two colors with very similar hues,
				// unless they have vastly different saturations
				if (
					(Math.abs(color.getHue() - mainSet[i].getHue()) <= 15) &&
					(Math.abs(color.getSaturation() - mainSet[i].getSaturation()) <= 50)
				) {
					return false;
				}
			}

			return true;
		};

		let mainSetFull = () => {
			return (
				(mainSet.length >= (colors.length * 2)) ||
				(mainSet.length >= mainSetMaximum)
			);
		};

		let generated;
		while(!mainSetFull()) {
			if (Math.random() > 0.5) {
				generated = new Color(mixer.generateHSVColor());
			} else {
				generated = new Color(mixer.generateRGBColor());
			}

			if (checkAddGenerated(generated)) {
				mainSet.push(generated);
			}
		}

		if (!this.hasGrey(mainSet)) {
			// make a random one much greyer
			// if it was previously light, make it be mid-tone
			const index = mixer.generateRandomInteger(0, mainSet.length - 1);

			mainSet[index] = new Color({
				'hue': mainSet[index].getHue(),
				'saturation': Mixer.clamp(mainSet[index].getSaturation() - 50, 0, 100),
				'value': Mixer.clamp(mainSet[index].getValue(), 0, 50),
			});
		}

		mainSet.sort(function(a, b) {
			return a.getHue() - b.getHue();
		});

		let palette = [];

		mainSet.forEach((mainColor) => {
			let shade = this.generateShade(mainColor);
			let tint = this.generateTint(mainColor);

			if (tint.getValue() >= 98 && tint.getSaturation() >= 98) {
				// it capped out; 2 shades
				palette.push(this.generateShade(shade));
				palette.push(shade);
				palette.push(mainColor);
			} else if (shade.getValue() <= 2 && shade.getSaturation <= 2) {
				// it bottomed out; 2 tins
				palette.push(mainColor);
				palette.push(tint);
				palette.push(this.generateTint(tint));
			} else {
				palette.push(shade);
				palette.push(mainColor);
				palette.push(tint);
			}
		});

		this.setState({
			'colors': colors,
			'palette': palette,
		});
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

				<Generator
					onClick={() => this.generatePalette()}
					hasPalette={this.state.palette.length > 0}
				/>

				<Palette
					colors={this.state.palette}
				/>
			</div>
		);
	}
}

export default App;


