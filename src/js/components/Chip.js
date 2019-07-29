import React, { Component } from 'react';

import Saffron from './../Saffron';

class Chip extends Component {

	/**
	 * Like a paint chip
	 *
	 * @todo "is removable" property?
	 *
	 * @param {object} props
	 * @param {Color} props.color
	 */
	constructor(props) {
		super(props);
	}

	getColorName() {
		const row = Saffron.getClosestMatch(this.props.color);

		return row.name;
	}

	getColorHexString() {
		return this.props.color.getHexString();
	}

	getColorRGBString() {
		return this.props.color.getRGBString();
	}

	getColorHSVString() {
		return this.props.color.getHSVString();
	}

	/**
	 * Is this color quiet, or bold?
	 * Based on saturation
	 *
	 * @returns {string}
	 */
	getColorVibrance() {
		const saturation = this.props.color.getSaturation();

		if (saturation >= 85) {
			return 'vibrant';
		}

		if (saturation >= 55) {
			return 'bold';
		}

		if (saturation >= 45) {
			return 'plain';
		}

		if (saturation >= 30) {
			return 'soft';
		}

		if (saturation >= 15) {
			return 'muted';
		}

		return 'grey';
	}


	/**
	 * Is this color warm or cool?
	 * Based on hue, but with an adjustment for greyscale
	 *
	 * @returns {string}
	 */
	getColorTemperature() {
		const saturation = this.props.color.getSaturation();

		if (saturation <= 2) {
			return 'greyscale';
		}

		const hue = this.props.color.getHue();

		// 40 deg is LAVA HOT (FFAA00) orange
		// 220 deg is ICE COLD (0055FF) blue
		// this is based 100% on personal judgment

		/**
		 * Calculate the smallest angular distance between
		 *
		 * @param {number} one - angle in degrees
		 * @param {number} two - angle in degrees
		 */
		function getAngularDelta(one, two) {
			const diff = Math.abs(one - two) % 360;

			return diff > 180 ? 360 - diff : diff;
		}

		const cutoff = 75; // degrees away

		const heatDelta = getAngularDelta(hue, 40);
		const coldDelta = getAngularDelta(hue, 220);

		if (heatDelta <= cutoff) {
			return 'warm';
		}
		if (coldDelta <= cutoff) {
			return 'cool';
		}

		return 'moderate';
	}


	/**
	 * Is this color dark or light?
	 * You'd think that this would be based on value,
	 * But it's actually based on perceived brightness
	 *
	 * @returns {string}
	 */
	getColorIllumination() {
		const weightedValue = this.props.color.getBrightness(); // [0-255]

		if (weightedValue >= 150) {
			return 'light';
		}

		if (weightedValue <= 100) {
			return 'dark';
		}

		return 'mid-tone';
	}

	render () {
		const topStyle = {
			'backgroundColor': this.getColorHexString(),
			'color': this.getColorIllumination() === 'light' ? '#212121' : 'white',
		};

		const vibrance = this.getColorVibrance();
		const temperature = this.getColorTemperature();
		const illumination = this.getColorIllumination();

		const hex = this.getColorHexString();
		const rgb = this.getColorRGBString();
		const hsv = this.getColorHSVString();

		const name = this.getColorName();

		return (
			<div className="Chip">
				<div className="top" style={topStyle}>
					<div className="color-name">{name}</div>
					<div>{hex}</div>
				</div>
				<div className="bottom">
					<div className="description">{vibrance}, {temperature}, {illumination}</div>
					<div>{rgb}</div>
					<div>{hsv}</div>
				</div>
			</div>
		)
	}
}

export default Chip;


