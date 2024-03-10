async function get_chrome_major_version(){
	var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

	if (isChrome) {
		return parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);
	} else {
		return 0;
	}
}

function tab_comparator(a,b){
	return a.lastAccessed - b.lastAccessed;
	if(a.lastAccessed != undefined && b.lastAccessed != undefined){
		return a.lastAccessed - b.lastAccessed;
	}else{
		return a.id - b.id; // if lastAccessed not exist, use tab id
	}
}

async function move_tabs_to_new_window(){
    url = document.getElementById('TARGET_URL').value;
	targetTabs = []
	tabs = await chrome.tabs.query({});
		
	for(let tab of tabs){
		if(tab.url.indexOf(url) > 0){
			// if(!tab.lastAccessed) // if lastAccessed not exist, set 0
				// tab.lastAccessed = 0;
			await targetTabs.push(tab); // get all tabs
		}
	}
	
	if(targetTabs.length > 0){
		
		await console.log("lastAccessed");
		await console.log(targetTabs[0].lastAccessed);
		
		if(await get_chrome_major_version() >= 121){
			await console.log("before sort");
			await console.log(targetTabs);
			await targetTabs.sort(tab_comparator); // sort targetTabs
			await console.log("after sort");
			await console.log(targetTabs);
		}
		
		await chrome.windows.create({}, (w)=>{
			// move tabs to new window
			chrome.tabs.move(
				targetTabs.map((t)=>{return t.id;}), // get tab ids from tabs
				{"index": -1, "windowId": w.id}
			); 
		});
	}
}

window.addEventListener("load", ev => {
    document
		.getElementById('move_tabs_to_new_window_button')
		.addEventListener('click', move_tabs_to_new_window);
});
