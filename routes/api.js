var express = require('express')
var querystring = require('querystring');
var http = require('http');
var router = express.Router();

var unica = '';
var paikat = 'Missään ei ole makkaraa. :(';
var postData = querystring.stringify({
	'msg': 'Hello World!'
});
var options = {
	hostname: 'www.unica.fi',
	port: 80,
	path: '/fi',
	method: 'POST',
	headers: {
		'Content-Type': 'text/html'
	}
};
var request = http.request(options, (res) => {
	console.log(`STATUS: ${res.statusCode}`);
	console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	res.setEncoding('utf8');
	res.on('data', (chunk) => {
		unica += `BODY: ${chunk}`;
	});
	res.on('end', () => {
		console.log('No more data in response.');
		// Get info from data
		var regex = /makkaramix/gi;
		var matches = unica.match(regex);
		if(matches != null) {
			var ravintolat = unica.match(/<h2>(.*)<\/h2>/g);
			console.log("Ravintolat ennen splicea: " + ravintolat);
			ravintolat.splice(0, 1);
			console.log("Ravintolat sen jälkeen: " + ravintolat);
			var ravintolaindeksit = [];
			for(i = 0; i < ravintolat.length; i++){
				ravintolaindeksit.push(unica.search(ravintolat[i]));
				ravintolat[i] = ravintolat[i].replace(/<h2>/, '').replace(/<\/h2>/, '');
			}
			console.log(ravintolaindeksit.length + ':n paikkaan löytyi ruokalistat.')
			console.log("Ravintolat tagipuhdistuksen jälkeen: " + ravintolat);
			console.log("Ravintoloiden sijainti HTML tiedustelussa: " + ravintolaindeksit);
			var onMix = [];
			for(i = 0; i < ravintolaindeksit.length-1; i++){
				if(unica.substring(ravintolaindeksit[i], ravintolaindeksit[i+1]).search(regex) > 0){
					console.log(unica.substring(ravintolaindeksit[i], ravintolaindeksit[i+1]));
					onMix.push(ravintolat[i]);
				}
			}
			if(unica.substring(ravintolaindeksit[ravintolaindeksit.length-1]).search(regex) > 0){
				onMix.push(ravintolat[ravintolat.length-1]);
			}
			if(onMix.length > 0){
				paikat = 'Näissä paikoissa on makkaraa: ' + onMix;
			}
		}
	});
});
request.on('error', (e) => {
	console.log(`problem with request: ${e.message}`);
});
request.write(postData);
request.end();

router.route('/').get(function(req, res) {
	res.send({
		message: paikat
	});
});

module.exports = router;