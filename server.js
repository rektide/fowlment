var WD= require("wd")

// utility

function rand(n){
	return Math.floor(Math.random()*n)+1
}

function delay(a){
	var s= rand(20)+rand(20)*1000
	return Q.delay(s).then(function(){return a})
}

// get a webdriver

var wd= WD.promiseRemote().init({
	browserName: "chrome",
	name: "birdie-tour"
})

// create a background window for work




// don't stop can't stop won't stop


function iter(){
	return wd.get("http://google.com")
}
