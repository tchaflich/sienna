

import React, { Component } from 'react';
import Saffron from '../Saffron';

class Header extends Component {

	constructor(props) {
		super(props);
	}

	/**
	 * Get the type that our set palette is
	 *
	 * @returns {string}
	 */
	getPaletteType() {
		return this.props.palette.getPaletteType();
	}


	/**
	 * Are we using "a", or "an"?
	 * Doesn't account for the entirely of english,
	 * but works for our limited use case of "palette types"
	 *
	 * @param {string} word
	 */
	getLeadingArticle(word) {
		const vowels = ['a', 'e', 'i', 'o', 'u'];
		return (
			vowels.indexOf(word.charAt(0)) !== -1 ?
				'an' :
				'a'
		);
	}

	/**
	 * Maps a color to name from Saffron
	 *
	 * @param {Color} color
	 */
	getColorName(color) {
		return Saffron.getClosestMatch(color).name;
	}


	/**
	 * Takes a list of strings and makes it a single pretty string
	 * ["Blue", "Yellow", "Orange"] => "Blue, Yellow, and Orange"
	 * (Includes Oxford Comma, fight me)
	 *
	 * @param {Array.<string>} strings
	 */
	combineStringList(strings) {
		if (!strings || strings.length === 0) {
			return ''; // wat
		}

		if (strings.length === 1) {
			return strings[0];
		}

		if (strings.length === 2) {
			return strings.join(' and ');
		}

		return (strings.slice(0, -1).join(', ') + ', and ' + strings[strings.length - 1]);
	}


	/**
	 * Retrieve the main colors from the palette
	 *
	 * @returns {Array.<Color>}
	 */
	getMainColors() {
		const grid = this.props.palette.getPalette();
		let i;

		return grid.map((list) => {
			for (i = 0; i < list.length; i++) {
				if (list[i].main) {
					return list[i].color;
				}
			}
		})
	}

	render() {
		const type = this.getPaletteType();
		const mainColors = this.getMainColors();
		const mainColorString = this.combineStringList(mainColors.map(this.getColorName))


		return (
			<div className="Header">
				<h1>
					Have you considered {this.getLeadingArticle(type)} {type} palette?
				</h1>
				<h3>
					Try one with {mainColorString}.
				</h3>
			</div>
		);
	}

}

export default Header;
