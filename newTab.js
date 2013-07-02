// via http://blog.nsissoft.com/2012/01/10/creating-new-window-in-selenium-2-webdriver-java/

var Q= require("q")

function _scriptInjection(link,id){
	id= id||link
	return "\
var anchorTag= document.createElement('a'); \
anchorTag.appendChild(document.createTextNode('nwh')); \
anchorTag.setAttribute('href', '"+link+"'); \
anchorTag.setAttribute('id', '"+id+"'); \
anchorTag.setAttribute('target', '_blank'); \
anchorTag.setAttribute('style', 'display:block;'); \
document.getElementsByTagName('body')[0].appendChild(anchorTag);"
}

function _scriptDejection(id){
	return "var removeEl= document.getElementById('"+id+"');removeEl.parentNode.removeChild(removeEl);"
}

var _id= "newTabTempLink"

module.exports= function(wd,link){
	return Q.all([ // get handles, handle, and inject a link
		wd.getWindowHandles(),
		wd.getWindowHandle(),
		wd.execute(_scriptInjection(link,_id))
	]).then(function(state){
		return wd.elementById(_id).then(function(el){ // find link
			return wd.clickElement(el) // click link
		}).then(function(){
			return wd.execute(_scriptDejection(_id)) // remove link injection
		}).then(function(){
			state.push(wd.getWindowHandles(),wd.getWindowHandle()) // final state
			return Q.all(state)
		})
	}
}

module.exports.background= function(wd,link){
	return module.exports(wd,link).then(function(handleStates){
		return wd.window(handleStates[1]).then(function(){
			return handleStates
		})
	})
}
