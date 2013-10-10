var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(function(data) {
                var latitude = data.coords.latitude;
                var longitude = data.coords.longitude;
                console.log("Lat:" + latitude + " | Lng: " + longitude);
            });
        }
        else{
            alert("GeoLocation is not available.");
        }
    }
};
