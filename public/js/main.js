var currentTempInCelsius;
window.onload = function () {
    if (navigator.geolocation) {
        //Return the user's longitude and latitude on page load using HTML5 geolocation API
        var currentPosition;
        function getCurrentLocation(position) {
            currentPosition = position;
            latitude = currentPosition.coords.latitude;
            longitude = currentPosition.coords.longitude;
            //AJAX request

            $.ajax({
                url: '/',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    type: 'coordinates',
                    latitude: latitude,
                    longitude: longitude
                }),
                success: function (data) {
                    location.reload();
                }
            });
        };
    }
    navigator.geolocation.getCurrentPosition(getCurrentLocation);
}