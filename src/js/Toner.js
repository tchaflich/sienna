
import Color from './Color.js';
import ColorScheme from './ColorScheme.js';

class Toner {

	/**
	 * Set the base color for this series
	 * It is guaranteed to be included in any set
	 * Its saturation and hue will be reused heavily,
	 * while its value is subject to variance
	 *
	 * @param {Color} baseColor
	 */
	constructor(baseColor) {
		this.baseColor = baseColor;
	}


	/**
	 * Create a series of shades and tints,
	 * using the base color passed to the constructor
	 *
	 * @param {number} count
	 */
	generateSet(count) {
		const minValue = 10;
		const maxValue = 95;

		const valueDelta = Math.min(
			Math.floor((maxValue - minValue) / (count + 2)),
			20
		);

		let list = [this.baseColor];
		// let next = this.baseColor;

		let shade = this.baseColor;
		let tint = this.baseColor;

		while (list.length < count) {
			shade = this.generateShade(shade, valueDelta);
			tint = this.generateTint(tint, valueDelta);

			const lastLength = list.length;
			if (shade.getValue() > minValue) {
				list.push(shade);
			}

			if (list.length >= count) {
				break;
			}

			if (tint.getValue() < maxValue) {
				list.push(tint);
			}

			if (lastLength === list.length) {
				break; // for safety!
			}
		}

		return list.sort(ColorScheme.compareColors);
	}


	/**
	 * Make a darker version of the sent color
	 *
	 * @param {Color} fromColor - Generate shade of *this* color
	 * @param {number} valueDelta - Difference in value
	 * @returns {Color} - The shade
	 */
	generateShade(fromColor, valueDelta) {
		return new Color({
			'hue': fromColor.getHue(),
			'saturation': fromColor.getSaturation(),
			'value': fromColor.getValue() - valueDelta,
		});
	}


	/**
	 * Make a lighter version of the sent color
	 *
	 * @param {Color} fromColor - Generate tint of *this* color
	 * @param {number} valueDelta - Difference in value
	 * @returns {Color} - The tint
	 */
	generateTint(fromColor, valueDelta) {
		return new Color({
			'hue': fromColor.getHue(),
			'saturation': fromColor.getSaturation(),
			'value': fromColor.getValue() + valueDelta,
		});
	}

}

export default Toner;

