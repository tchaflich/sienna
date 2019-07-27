import React, { Component, } from 'react';

class Palette extends Component {


	constructor(props) {
		super(props);
	}

	render () {
		return (
			<div className="Palette">

				<pre>
					{JSON.stringify(this.props.colors, null, 2)}
				</pre>

			</div>
		);
	}
}

export default Palette;


