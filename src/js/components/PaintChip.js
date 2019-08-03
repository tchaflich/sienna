

import React, { Component } from 'react';
import Saffron from '../Saffron';
// import Color from '../Color';

class PaintChip extends Component {

	constructor(props) {
		super(props);
	}

	getTextColor(color) {
		return color.getBrightness() > 140 ? 'black' : 'white';
	}

	renderColor(color, isMain) {
		let styles = {
			'color': this.getTextColor(color),
			'backgroundColor': color.getHexString(),
		};
		let classNames = ['tiny-chip'];
		if (isMain) {
			classNames.push('main');
		}
		return (
			<div className={classNames.join(' ')} key={color.getHexString()} style={styles}>
				<div className="hex">{color.getHexString()}</div>
				<div className="hsv">{color.getHSVString()}</div>
				<div className="name">{Saffron.getClosestMatch(color).name}</div>
			</div>
		)
	}

	render() {
		let colors = this.props.colorList.map((item) => {
			return this.renderColor(item.color, item.main);
		});
		return (<div className="PaintChip">{colors}</div>);
	}

}

export default PaintChip;
