var WD= require("wd")

// utility

function rand(n){
	return Math.floor(Math.random()*n)+1
}

/**
 * @param n number of dice
 * @param m sides per dice
 * @param f factor to multiply by, 100 by default
 * @param c constant factor to add (pre factor)
 */
function dice(n,m,f,c){
	f= f||100
	c= c||0
	for(var i= 0; i< n; ++i)
		c+= rand(m)
	return c*f
}

function diceDelay(n,m,f,c){
	var ms= dice(n,m,f,c)
	return function(a){
		return Q.delay(a,ms)
	}
}

function delay(a){
	return Q.delay(a,dice(2,20,1000))
}

// get a webdriver

var wd= WD.promiseRemote().init({
	browserName: "chrome",
	name: "birdie-tour"
})

// don't stop can't stop won't stop

function iter(){
	return newTab(wd).then(_search).then(_nav).then(delay).then(iter)
}

function _search(){
	return wd.get("http://google.com").then(function(){
		return wd.keys("birds\uE007")
	}).delay(diceDelay(2,12,100,5))
}

function _nav(){
	return wd.elementByCss("h3 a").then(function(links){
		var i= rand(links.length),
     	  link= links[i]
     	return wd.clickElement(link)
	})
}
