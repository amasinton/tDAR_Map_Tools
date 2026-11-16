    const coordsDiv = document.getElementById("coords");
    const copyButton = document.getElementById("copyButton");
    copyButton.addEventListener("click", copyCoords);
    var map = L.map('map').setView([33.41895562450002, -111.93636154091655], 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Bounding box drawing
    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    var drawControl = new L.Control.Draw({
        draw: {
            polyline: false,
            polygon: false,
            circle: false,
            marker: false,
            circlemarker: false,
            rectangle: true
        },
        edit: {
            featureGroup: drawnItems,
            edit: false,
            remove: true
        }
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (e) {
        var layer = e.layer;
        drawnItems.addLayer(layer);
        var ltype = e.layerType;
        if (ltype === 'rectangle')
        {
            var bounds = layer.getBounds();
            coordsDiv.textContent = bounds.getEast() + ";" + bounds.getNorth() + ";" + bounds.getSouth() + ";" + bounds.getWest();
        }
    })

    // Leaflet GeosSearch
    const { GeoSearchControl, OpenStreetMapProvider } = window.GeoSearch;

    const searchProvider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
        provider: searchProvider,
        style: "bar",
        position: "topleft",
        showMarker: true,
        showPopup: false,
        marker: {
            draggable: false,
        },

        autoClose: true,
        retainZoomLevel: false,
        animateZoom: true,
        keepResult: true,

        searchLabel: "Search for a country, state, city…",
        notFoundMessage: "No matching location found",
    });

    map.addControl(searchControl);

    function copyCoords ()
    {
        const coordsText = coordsDiv.innerText;
        const copyButton = document.getElementById("copyButton");
        navigator.clipboard.writeText(coordsText)
            .then(() => {
                copyButton.innerText = "Copied!";
                copyButton.style.backgroundColor = "#4CAF50";
                
                // Reset the button state after 2 seconds
                setTimeout(() => {
                    copyButton.innerText = "Copy Text";
                    copyButton.style.backgroundColor = ""; 
                }, 2000);
            })
            .catch(err => {
                console.error("Failed to copy coords: ", err);
        });
    }
