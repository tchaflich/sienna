import React, { Component } from 'react';

import Header from './Header.js';
import PaintChip from './PaintChip.js';

import Palette from './../Palette.js';
import ColorScheme from '../ColorScheme.js';
// import Saffron from './../Saffron.js';


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
			'palette': new Palette(),
		};
	}

	renderPaintChip(colorList, paletteIndex) {
		return (
			<PaintChip key={paletteIndex} colorList={colorList} />
		);
	}

	chooseThemeColors() {
		let neutralLine;
		this.state.palette.getPalette().forEach((line) => {
			if (
				!neutralLine ||
				neutralLine[0].color.getSaturation() > line[0].color.getSaturation()
			) {
				neutralLine = line;
			}
		});

		let colors = neutralLine.map((i) => {
			return i.color;
		}).sort(ColorScheme.compareColors);

		return ColorScheme.shuffleArray([colors[0], colors[colors.length - 1]]);
	}

	render () {
		let paintChips = this.state.palette.getPalette().map(this.renderPaintChip);
		let themeColors = this.chooseThemeColors();
		let styles = {
			'color': themeColors[0].getHexString(),
			'backgroundColor': themeColors[1].getHexString(),
		};
		return (
			<div className='App' style={styles}>
				<div className="sizer">
					<Header palette={this.state.palette} />
					{paintChips}
				</div>
			</div>
		);
	}
}

export default App;


