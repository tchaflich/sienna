


class Color {

	/**
	 * Accepts a single argument that describes a color
	 *
	 * @param {string|object} parseable
	 */
	constructor(parseable) {
		if (!parseable) {
			throw new Error('requires an argument to its constructor');
		}

		// init parameters
		// rgb are always either set or calculated;
		// hsv are set if available, otherwise calculated on the fly

		this.red_ = null; // [0, 255]
		this.green_ = null; // [0, 255]
		this.blue_ = null; // [0, 255]

		this.hue_ = null; // [0, 360)
		this.saturation_ = null; // [0, 100]
		this.value_ = null; // [0, 100]

		// pass to the appropriate parsing function based on type

		if (parseable instanceof Color) {
			this.parseColor_(parseable);
			return;
		}

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
			throw new Error('invalid argument passed to constructor');
		}
	}


	/**
	 * Called from constructor; this parses the string
	 *
	 * @private
	 *
	 * @param {string} parseableString - A color string
	 * @returns {undefined}
	 */
	parseString_(parseableString) {
		// do a quick regexp match to see which function to call
		// if none of these match, format is unknown
		// all are case-insensitive

		// match on "#rgb" or "#rrggbb"
		// match on "rgb" or "rrggbb"
		// where r(r), g(g), and b(b) are valid hex digits
		const hexTest = /^#?[0-9a-f]{3,6}$/i;

		// from here on out, whitespace is optional

		// match on a, b, c
		// this will default to RGB parsing
		const commaTest = /^\d+,\s*\d+,\s*\d+$/;

		// match on rgb(r, g, b)
		// this is also the preferred match for a, b, c (todo)
		const RGBTest = /^rgb\(\d+,\s*\d+,\s*\d+\)$/i;

		// match on hsv(h, s, v) or (h°, s%, v%)
		// or any combination of the above parameters
		// this one requires hsv leader
		const HSVTest = /^hsv\(\d+,\s*\d+,\s*\d+\)$/i;

		let known;

		if (hexTest.test(parseableString)) {
			known = Color.hexStringToRGB(parseableString);
			this.red_ = known.red;
			this.green_ = known.green;
			this.blue_ = known.blue;
		} else if (commaTest.test(parseableString) || RGBTest.test(parseableString)) {
			known = Color.RGBStringToRGB(parseableString);
			this.red_ = known.red;
			this.green_ = known.green;
			this.blue_ = known.blue;
		} else if (HSVTest.test(parseableString)) {
			known = Color.HSVStringToHSV(parseableString);
			this.hue_ = known.hue;
			this.saturation_ = known.saturation;
			this.value_ = known.value;

			// we always want to set RGB, so convert immediately

			const RGB = Color.convertHSVtoRGB(known);

			this.red_ = RGB.red;
			this.green_ = RGB.green;
			this.blue_ = RGB.blue;
		}
	}


	/**
	 * Called from constructor; this parses an object
	 * If you have RGB values already and don't want to format / parse them,
	 * this way skips all that and sets directly from the numeric values
	 *
	 * @private
	 *
	 * @param {object} parseableObject - A color object
	 * @returns {undefined}
	 */
	parseObject_(parseableObject) {
		// rgb
		if (
			'red' in parseableObject &&
			'green' in parseableObject &&
			'blue' in parseableObject
		) {
			this.red_ = parseableObject.red;
			this.green_ = parseableObject.green;
			this.blue_ = parseableObject.blue;

			return;
		}

		// hsv
		if (
			'hue' in parseableObject &&
			'saturation' in parseableObject &&
			'value' in parseableObject
		) {
			this.hue_ = parseableObject.hue;
			this.saturation_ = parseableObject.saturation;
			this.value_ = parseableObject.value;

			// always want to set RGB properties
			let rgbObject = Color.convertHSVtoRGB(parseableObject);
			this.parseObject_(rgbObject);

			return;
		}

		throw new Error('Cannot determine color object type');
	}


	/**
	 * Copy another Color object sent to the constructor
	 *
	 * @param {Color} parseableColor
	 */
	parseColor_(parseableColor) {
		this.red_ = parseableColor.getRed();
		this.blue_ = parseableColor.getBlue();
		this.green_ = parseableColor.getGreen();
	}


	// static parsers and converters


	/**
	 * Parse a hex string and convert to RGB object
	 *
	 * @param {string} hexString
	 * @returns {object}
	 */
	static hexStringToRGB(hexString) {
		// remove any leading octothorpe
		const normalized = (hexString
			.replace(/^#/, '')
			.toUpperCase()
		);

		/**
		 * Quick converter helper
		 *
		 * @param {string} s
		 * @returns {number}
		 */
		function hexToDec(s) {
			return parseInt(s, 16);
		}

		if (normalized.length === 3) {
			// 3 digit shorthand "1" => "11", "a" => "aa", "f" => "ff"
			// multiply by 17 to get the math right
			return {
				'red': hexToDec(normalized.charAt(0)) * 17,
				'green': hexToDec(normalized.charAt(1)) * 17,
				'blue': hexToDec(normalized.charAt(2)) * 17,
			};
		}

		if (normalized.length === 6) {
			return {
				'red': hexToDec(normalized.substr(0, 2)),
				'green': hexToDec(normalized.substr(2, 2)),
				'blue': hexToDec(normalized.substr(4, 2)),
			};
		}

		throw new Error('Could not parse hex string (unknown format)');
	}


	/**
	 * Parse an RGB or comma-delimited string and convert to RGB object
	 *
	 * @param {string} RGBString
	 * @returns {object}
	 */
	static RGBStringToRGB(RGBString) {
		const matcher = /^\s*(?:rgb\()?\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)?\s*$/i
		const matched = RGBString.match(matcher);

		if (!matched) {
			throw new Error('Invalid RGB string format');
		}

		/**
		 * Helper for parseInt
		 *
		 * @param {string} s
		 * @returns {number}
		 */
		function num(s) {
			const n = parseInt(s, 10);
			if (isNaN(n)) {
				throw new Error('Invalid numeric value');
			}
			return n;
		}

		/**
		 * Helper for checking if values are in range
		 * Returns value unchanged,
		 * but throws error if invalid
		 *
		 * @param {number} n
		 * @returns {number}
		 */
		function check(n) {
			if (n < 0 || n > 255) {
				throw new Error('Value out of RGB range');
			}

			return n;
		}

		return {
			'red': check(num(matched[1])),
			'green': check(num(matched[2])),
			'blue': check(num(matched[3])),
		};

	}


	/**
	 * Parses an HSV comma-delimited string to HSV object
	 *
	 * @param {string} HSVString
	 * @returns {object}
	 */
	static HSVStringToHSV(HSVString) {
		const matcher = /^\s*(?:hsv\()?\s*([0-9-]+)\s*(?:°|deg)?\s*,\s*(\d+)\s*%?\s*,\s*(\d+)\s*%?\s*\)?\s*$/i
		const matched = HSVString.match(matcher);

		/**
		 * Helper for parseInt
		 *
		 * @param {string} s
		 * @returns {number}
		 */
		function num(s) {
			return parseInt(s, 10) || 0;
		}


		/**
		 * Helper for checking if values are in range
		 * Returns value unchanged,
		 * but throws error if invalid
		 *
		 * @param {number} n
		 * @returns {number}
		 */
		function checkSV(n) {
			if (n < 0 || n > 100) {
				throw new Error('Value out of Saturation/Value range');
			}

			return n;
		}

		const HSV = {
			'hue': num(matched[1]),
			'saturation': checkSV(num(matched[2])),
			'value': checkSV(num(matched[3])),
		};

		HSV.hue = Color.getNormalizedHue(HSV.hue);

		return HSV;
	}


	/**
	 * Converts an HSV object to an RGB object
	 *
	 * @param {object} HSVObject
	 * @returns {object}
	 */
	static convertHSVtoRGB(HSVObject) {
		// https://www.rapidtables.com/convert/color/hsv-to-rgb.html

		const hue = HSVObject.hue; // [0-360)
		const saturation = HSVObject.saturation / 100; // [0-1]
		const value = HSVObject.value / 100; // [0-1]

		const c = value * saturation;
		const x = (c * (1 - Math.abs(((hue / 60) % 2) - 1)));
		const m = value - c;

		let r;
		let g;
		let b;

		if (hue < 60) {
			r = c;
			g = x;
			b = 0;
		} else if (hue < 120) {
			r = x;
			g = c;
			b = 0;
		} else if (hue < 180) {
			r = 0;
			g = c;
			b = x;
		} else if (hue < 240) {
			r = 0;
			g = x;
			b = c;
		} else if (hue < 300) {
			r = x;
			g = 0;
			b = c;
		} else {
			r = c;
			g = 0;
			b = x;
		}

		return {
			'red': Math.round((r + m) * 255),
			'green': Math.round((g + m) * 255),
			'blue': Math.round((b + m) * 255),
		};
	}


	/**
	 * Converts an RGB object to an HSV object
	 *
	 * @param {object} RGBObject
	 * @returns {object}
	 */
	static convertRGBtoHSV(RGBObject) {
		// http://en.wikipedia.org/wiki/HSL_and_HSV#General_approach
		// https://www.rapidtables.com/convert/color/rgb-to-hsv.html

		// conversion algorithms normalize from [0-255] => [0-1]

		const red = RGBObject.red / 255;
		const green = RGBObject.green / 255;
		const blue = RGBObject.blue / 255;

		const max = Math.max(red, green, blue);
		const min = Math.min(red, green, blue);

		var hue = (max + min) / 2;
		var saturation = (max + min) / 2;
		var value = max;

		// if the max(rgb) is min(rgb) then the color is greyscale
		// by convention, hue is zero (red) in this case

		if (max === min) {
			hue = 0;
			saturation = 0;
		} else {
			const delta = max - min;

			saturation = delta / max;

			if (max === red) {
				// hue = ((green - blue) / delta) + (green < blue ? 6 : 0);
				hue = ((green - blue) / delta) % 6;
			} else if (max === green) {
				hue = ((blue - red) / delta) + 2;
			} else {
				hue = ((red - green) / delta) + 4;
			}
		}

		// normalize hue to standard degrees [0-360)

		// normalize saturation and value to percentages [0-100]

		hue = Color.getNormalizedHue(hue * 60);

		return {
			'hue': Math.round(hue),
			'saturation': Math.round(saturation * 100),
			'value': Math.round(value * 100),
		};
	}


	static getNormalizedHue(hue) {
		var n = hue % 360;

		while (n < 0) {
			n += 360;
		}

		return n;
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


	// HSV colorspace


	/**
	 * Grabs the currently parsed RGB values and creates HSV from them
	 * Should only be called once, the first time an HSV value is demanded
	 *
	 * @private
	 *
	 * @returns {undefined}
	 */
	convertRGBtoHSV_() {
		let HSV = Color.convertRGBtoHSV({
			'red': this.getRed(),
			'green': this.getGreen(),
			'blue': this.getBlue(),
		});

		this.hue_ = HSV.hue;
		this.saturation_ = HSV.saturation;
		this.value_ = HSV.value;
	}

	/**
	 * Gets the hue component of this color, computing if necessary
	 *
	 * @returns {number} [0-360)
	 */
	getHue() {
		if (this.hue_ === null) {
			this.convertRGBtoHSV_();
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
			this.convertRGBtoHSV_();
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
			this.convertRGBtoHSV_();
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

	// CIE L*a*b* todo


	// calculated values

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


	/**
	 * Get the perceived brightness of a color
	 * Corrects for the human eye's differing sensitivity to color
	 * Green appears very bright, red is pretty bright,
	 * and blue is downright *dark*
	 *
	 * http://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx
	 *
	 * @returns {number} [0-255]
	 */
	getBrightness() {
		return Math.sqrt(
			(0.241 * Math.pow(this.getRed(), 2)) +
			(0.691 * Math.pow(this.getGreen(), 2)) +
			(0.068 * Math.pow(this.getBlue(), 2))
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

