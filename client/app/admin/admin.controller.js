'use strict';

export default class AdminController {
  /*@ngInject*/
  constructor(keen) {
  	this.keen = keen;
		this.states = [{
			name: 'landed',
			id: 'landed',
			colour: '#c0392b'
		},{
			name: 'pressedOrder',
			id: 'pressed-order',
			colour: '#e74c3c'
		},{
			name: 'audioUploaded',
			id: 'audio-uploaded',
			colour: '#d35400'
		},{
			name: 'orderConfirmed',
			id: 'order-confirmed',
			colour: '#e67e22'
		},{
			name: 'openedCheckout',
			id: 'opened-checkout',
			colour: '#2980b9'
		},{
			name: 'choseFile',
			id: 'chose-file',
			colour: '#2ecc71'
		}]
	}

	$onInit(){
		this.keen.keys().then(keys => {
			this.client = new Keen({
		    projectId: keys.data.keenProjectId,       // String (required)
		    readKey: keys.data.keenReadKey  // String (required for querying data)
		  });
		  this.states.map(state => {
		  	let countPostcodes = new Keen.Query('count', {
		      eventCollection: state.name,
		      timeframe: 'this_30_days'
		    });
		    this.client.draw(countPostcodes, document.getElementById(state.id), {
		      chartType: 'metric',
		      title: state.name,
		      colors: [state.colour]
		    });
		  })
		})
	}
}
