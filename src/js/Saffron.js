
// shimming this in until api is hooked up
// class should function *roughly* the same in terms of applayer,
// but will likely need some heavy refactoring

import jsonData from './../../saffron.json';

import Color from './Color';

class Saffron {

	/**
	 * Grab all colors within a short cubic radius in RGB space
	 * Used to pare down options for heftier calculations
	 *
	 * @param {Color} color
	 * @returns {Array.<object>}
	 */
	static getCloseColors(color) {
		const range = 20;

		const minRed = (color.getRed() - range);
		const maxRed = (color.getRed() + range);

		const minGreen = (color.getGreen() - range);
		const maxGreen = (color.getGreen() + range);

		const minBlue = (color.getBlue() - range);
		const maxBlue = (color.getBlue() + range);

		return (jsonData).filter((row) => {
			return (
				(row.red >= minRed && row.red <= maxRed) &&
				(row.green >= minGreen && row.green <= maxGreen) &&
				(row.blue >= minBlue && row.blue <= maxBlue)
			);
		});
	}


	/**
	 * Gets a value which is linearly proportional to distance in RGB cubic space
	 * Does not strictly represent an exact value of anything;
	 * But if:
	 * - Set A contains 2 RGB compatible colors
	 * - Set B contains 2 RGB compatible colors
	 * - Lazy-distance of set A is greater than lazy-distance of set B
	 * then the two colors of set A are farther apart from one another
	 * than the two colors of set B are from one another.
	 * The reason this is used is that it's pretty fast to calculate.
	 *
	 * @param {Color} oneColor
	 * @param {Color} twoColor
	 * @returns {number}
	 */
	static getLazyDistance(oneColor, twoColor) {
		return (
			Math.pow(oneColor.getRed() - twoColor.getRed(), 2) +
			Math.pow(oneColor.getGreen() - twoColor.getGreen(), 2) +
			Math.pow(oneColor.getBlue() - twoColor.getBlue(), 2)
		);
	}


	/**
	 * Finds the closest match to the given color from Saffron DB
	 * If more than one match with the same priority is found,
	 * will return the first it encountered
	 *
	 * @param {Color} color
	 * @returns {object} The row from Saffron DB
	 */
	static getClosestMatch(color) {
		// this makes it faster the more colors there are,
		// and the tighter the range is
		// if it starts acting up, can just loop over all
		var filtered = Saffron.getCloseColors(color);
		if (!filtered.length) {
			filtered = jsonData;
		}

		const lowest = {
			'lazyDistance': null,
			'row': null,
		};

		let currentLazyDistance;

		filtered.forEach((row) => {
			currentLazyDistance = Saffron.getLazyDistance(color, new Color(row));
			if (lowest.lazyDistance === null || currentLazyDistance < lowest.lazyDistance) {
				lowest.lazyDistance = currentLazyDistance;
				lowest.row = row;
			}
		});

		return lowest.row;
	}

}

export default Saffron;

