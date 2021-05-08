get_device_access = (params) => {
	navigator.mediaDevices.getUserMedia(params).then(stream => {
		alert('Thanks for granting access! This window will close now.');
		chrome.tabs.getCurrent(function(tab) {
			chrome.tabs.remove(tab.id, function() { });
		});
	});
};
get_device_access({"audio": true, "video": false});