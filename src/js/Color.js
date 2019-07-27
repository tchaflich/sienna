

class Color {

	/**
	 * Accepts a single argument that describes a color
	 *
	 * @param {string|object} parseable
	 */
	constructor(parseable) {
		if (!parseable) {
			throw new Error('[Color] requires an argument to its constructor');
		}

		// init parameters
		// rgb are always either set or calculated;
		// hsl are set if available, otherwise calculated on the fly

		this.red_ = null; // [0, 255]
		this.green_ = null; // [0, 255]
		this.blue_ = null; // [0, 255]

		this.hue_ = null; // [0, 360)
		this.saturation_ = null; // [0, 100]
		this.value_ = null; // [0, 100]

		// pass to the appropriate parsing function based on type

		const type = (
			Object.prototype.toString.call(parseable)
				.replace(/^\[object ([a-z]+)\]$/i, '$1')
				.toLowerCase()
		);

		if (type === 'string') {
			this.parseString_(parseable);
		} else if (type === 'object') {
			this.parseObject_(parseable);
		} else {
			throw new Error('[Color] invalid argument passed to constructor');
		}
	}

	/**
	 * Called from constructor; this parses the string
	 *
	 * @todo Parse strings of rgb(RRR, GGG, BBB) format (may need refactor)
	 *
	 * @param {string} parseableString - A color string
	 * @returns {undefined}
	 */
	parseString_(parseableString) {
		const normalized = (
			parseableString
				.replace(/^#/, '')
				.toUpperCase()
		);

		if (normalized.length === 3) {
			// shorthand #RGB => #RRGGBB
			const red = parseInt(normalized.charAt(0), 16);
			const green = parseInt(normalized.charAt(1), 16);
			const blue = parseInt(normalized.charAt(2), 16);

			if (isNaN(red) || isNaN(green) || isNaN(blue)) {
				throw new Error('[Color] Invalid shorthand hex color (' + parseableString + ')');
			}

			this.red_ = (red * 17);
			this.green_ = (green * 17);
			this.blue_ = (blue * 17);
		} else if (normalized.length === 6) {
			// longhand #RRGGBB
			const red = parseInt(normalized.substr(0, 2), 16);
			const green = parseInt(normalized.substr(2, 2), 16);
			const blue = parseInt(normalized.substr(4, 2), 16);

			if (isNaN(red) || isNaN(green) || isNaN(blue)) {
				throw new Error('[Color] Invalid longhand hex color (' + parseableString + ')');
			}

			this.red_ = red;
			this.green_ = green;
			this.blue_ = blue;
		} else {
			throw new Error('[Color] Unparseable color string (' + parseableString + ')');
		}

		// todo: accept non-hex strings
	}

	/**
	 * Called from constructor; this parses an object
	 * If you have RGB values already and don't want to format / parse them,
	 * this way skips all that and sets directly from the numeric values
	 *
	 * @param {object} parseableObject - A color object
	 * @returns {undefined}
	 */
	parseObject_(parseableObject) {
		if ('red' in parseableObject) {
			this.red_ = parseableObject.red;
		} else if ('R' in parseableObject) {
			this.red_ = parseableObject.R;
		} else {
			throw new Error('[Color] Unknown red value in parseObject_');
		}

		if ('green' in parseableObject) {
			this.green_ = parseableObject.green;
		} else if ('G' in parseableObject) {
			this.green_ = parseableObject.G;
		} else {
			throw new Error('[Color] Unknown green value in parseObject_');
		}

		if ('blue' in parseableObject) {
			this.blue_ = parseableObject.blue;
		} else if ('B' in parseableObject) {
			this.blue_ = parseableObject.B;
		} else {
			throw new Error('[Color] Unknown blue value in parseObject_');
		}

		// todo: HSL => RGB
	}

	// RGB colorspace

	/**
	 * Gets the red component of this color
	 *
	 * @returns {number} [0-255]
	 */
	getRed() {
		return this.red_;
	}

	/**
	 * Get the green component of this color
	 *
	 * @returns {number} [0-255]
	 */
	getGreen() {
		return this.green_;
	}

	/**
	 * Gets the blue component of this color
	 *
	 * @returns {number} [0-255]
	 */
	getBlue() {
		return this.blue_;
	}

	// HSL values
	// these are calculated as a group, and stored

	/**
	 * Grabs the currently parsed RGB values and creates HSL from them
	 * Should only be called once, the first time an HSL value is demanded
	 *
	 * @returns {undefined}
	 */
	convertHSV_() {
		// http://en.wikipedia.org/wiki/HSL_and_HSV#General_approach
		// https://www.rapidtables.com/convert/color/rgb-to-hsv.html

		// conversion algorithms normalize from [0-255] => [0-1]

		const red = this.red_ / 255;
		const green = this.green_ / 255;
		const blue = this.blue_ / 255;

		const max = Math.max(red, green, blue);
		const min = Math.min(red, green, blue);

		var hue = (max + min) / 2;
		var sat = (max + min) / 2;
		var value = max;

		// if the max(rgb) is min(rgb) then the color is greyscale
		// by convention, hue is zero (red) in this case

		if (max === min) {
			hue = 0;
			sat = 0;
		} else {
			const delta = max - min;

			sat = delta / max;

			if (max === red) {
				// hue = ((green - blue) / delta) + (green < blue ? 6 : 0);
				hue = ((green - blue) / delta) % 6;
			} else if (max === green) {
				hue = ((blue - red) / delta) + 2;
			} else {
				hue = ((red - green) / delta) + 4;
			}
		}

		// normalize hue to standard degrees
		this.hue_ = (hue * 60) % 360;
		while (this.hue_ < 0) {
			this.hue_ = (this.hue_ + 360);
		}

		// saturation and value normalized to "percent"
		this.saturation_ = sat * 100;
		this.value_ = value * 100;
	}

	/**
	 * Gets the hue component of this color, computing if necessary
	 *
	 * @returns {number} [0-360)
	 */
	getHue() {
		if (this.hue_ === null) {
			this.convertHSV_();
		}

		return this.hue_;
	}

	/**
	 * Gets the saturation component of this color, computing if necessary
	 *
	 * @returns {number} [0-100]
	 */
	getSaturation() {
		if (this.saturation_ === null) {
			this.convertHSV_();
		}

		return this.saturation_;
	}

	/**
	 * Gets the value component of this color, computing if necessary
	 *
	 * @returns {number} [0-100]
	 */
	getValue() {
		if (this.value_ === null) {
			this.convertHSV_();
		}

		return this.value_;
	}


	// Y'CbCr colorspace
	// these are easy to calculate on the fly from RGB
	// uses ITU-R BT.601 conversion

	// need verifiable test examples for these


	/**
	 * Returns the luma in Y'CbCr (YCC) colorspace
	 *
	 * Effectively the "perceived brightness" of an RGB color
	 *
	 * https://en.wikipedia.org/wiki/YCbCr#ITU-R_BT.601_conversion
	 *
	 * @returns {number} [16-235]
	 */
	getLuma() {
		return (
			16 +
			(65.481 * (this.getRed() / 255)) +
			(128.553 * (this.getGreen() / 255)) +
			(24.996 * (this.getBlue() / 255))
		);
	}

	getChromaBlue() {
		return (
			128 +
			(-37.797 * (this.getRed() / 255)) +
			(-74.203 * (this.getGreen() / 255)) +
			(112.000 * (this.getBlue() / 255))
		);
	}

	getChromaRed() {
		return (
			128 +
			(112.000 * (this.getRed() / 255)) +
			(-93.786 * (this.getGreen() / 255)) +
			(-18.214 * (this.getBlue() / 255))
		);
	}

	// CIE L*a*b*

	// todo

	// more calculated values


	/**
	 * Get the *relative* luminance of a color
	 * Considering the white point is white and the black point is black,
	 * This is kind of just... the luminance
	 * ¯\_(ツ)_/¯
	 *
	 * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
	 *
	 * @returns {number} [0-1]
	 */
	getRelativeLuminance() {
		// convert from 8 bit color to sRGB
		const sR = (this.getRed() / 255);
		const sG = (this.getGreen() / 255);
		const sB = (this.getBlue() / 255);

		/**
		 * Calculate the luminance component from sRGB
		 *
		 * @param {number} s - sRGB component
		 */
		function getPart(s) {
			return (s <= 0.03928) ?
				(s / 12.92) :
				(Math.pow((s + 0.055) / 1.055, 2.4));
		}

		return (
			(0.2126 * getPart(sR)) +
			(0.7152 * getPart(sG)) +
			(0.0722 * getPart(sB))
		);
	}


	// output formatting


	/**
	 * Returns a hex string in the format #RRGGBB
	 * Example: Red => "#FF0000"
	 * Will return in uppercase for the hex digits
	 *
	 * @returns {string}
	 */
	getHexString() {
		/**
		 * Converts a decimal number to 2-char hex string
		 *
		 * @private
		 * @param {number} dec
		 */
		function convertDecToHex(dec) {
			let hex = Math.round(dec).toString(16);
			while (hex.length < 2) {
				hex = '0' + hex;
			}
			return hex;
		}

		return (
			'#' +
			convertDecToHex(this.getRed()) +
			convertDecToHex(this.getGreen()) +
			convertDecToHex(this.getBlue())
		).toUpperCase();
	}


	/**
	 * Returns an RGB string in the format RGB(r, g, b)
	 * Example: Red => "RGB(255, 0, 0)"
	 * The letters "RGB" will be uppercase
	 * The commas will have a trailing space
	 * Numeric values will be integers (rounded)
	 *
	 * @returns {string}
	 */
	getRGBString() {
		return (
			'RGB(' +
			Math.round(this.getRed()) + ', ' +
			Math.round(this.getGreen()) + ', ' +
			Math.round(this.getBlue()) + ')'
		);
	}

	/**
	 * Returns an HSV string in the format HSV(h°, s%, v%)
	 * Example: Red => "HSV(0°, 100%, 100%)"
	 * The letters "HSV" will be uppercase
	 * The commas will have a trailing space
	 * Numeric values will be integers (rounded)
	 *
	 * @returns {string}
	 */
	getHSVString() {
		return (
			'HSV(' +
			Math.round(this.getHue()) + '°, ' +
			Math.round(this.getSaturation()) + '%, ' +
			Math.round(this.getValue()) + '%)'
		);
	}


}

export default Color;

