// Public Token
mapboxgl.accessToken = "pk.eyJ1Ijoieml5aXpoYW5nMiIsImEiOiJja3VzZ21xNTIxbTZ6MnBxcnVjaXV5dnB3In0.YyG_Ac4LpzLJLOPLUdU3UQ";

// Global vars
var vizControl = d3.select("#mode-viz");
var statsControl = d3.select("#mode-stats");
var storyControl = d3.select("#mode-story");
var currentMode = "story";  //init mode
var neighborhood = "MN";
var daytime;
var daytime_stats;
var color_total = false;
let time = 0;
var day = 0;
var stime;
var sday;
const fp = {
    'Accommodation and Food Services': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Accommodation%20and%20Food%20Services.geojson',
    'Agriculture, Forestry and Fishing': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Agriculture%2C%20Forestry%20and%20Fishing.geojson',
    'Administrative and Support Services': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Administrative%20and%20Support%20Services.geojson',
    'Arts and Recreation Services': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Arts%20and%20Recreation%20Services.geojson',
    'Construction': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Construction.geojson',
    'Education and Training': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Education%20and%20Training.geojson',
    'Electricity, Gas, Water and Waste Services': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Electricity%2C%20Gas%2C%20Water%20and%20Waste%20Services.geojson',
    'Financial and Insurance Services': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Financial%20and%20Insurance%20Services.geojson',
    'Health Care and Social Assistance': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Health%20Care%20and%20Social%20Assistance.geojson',
    'Information Media and Telecommunications': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Information%20Media%20and%20Telecommunications.geojson',
    'Manufacturing': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Manufacturing.geojson',
    'Mining': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Mining.geojson',
    'Other Services': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Other%20Services.geojson',
    'Professional, Scientific and Technical Services': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Professional%2C%20Scientific%20and%20Technical%20Services.geojson',
    'Public Administration and Safety': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Public%20Administration%20and%20Safety.geojson',
    'Rental, Hiring and Real Estate Services': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Rental%2C%20Hiring%20and%20Real%20Estate%20Services.geojson',
    'Retail Trade': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Retail%20Trade.geojson',
    'Transport, Postal and Warehousing': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Transport%2C%20Postal%20and%20Warehousing.geojson',
    'Wholesale Trade': 'https://raw.githubusercontent.com/jianengli/iv_project/main/data/CLUE_Blocks_with_Stats_Wholesale%20Trade.geojson'
}
// LOCAL TIME //
var currentDate = new Date();
var currentDay = (currentDate.getDay() == 0) ? 6 : currentDate.getDay() - 1;
var currentHour = currentDate.getHours();

// Media Vars
var media;
var isNarrow = window.matchMedia("(max-width: 620px)");
function changeMedia(x) {
  if (x.matches) {
    
    // Update media var.
    media = "mobile";
    
    // Hide sliders from story mode ONLY.
    if (currentMode == "stats") {
      d3.select("#controls").style("bottom", "140px");
    } else {
      d3.select("#controls").style("bottom", "30px");
    }

  } else {
    media = "full";
    d3.select("#controls").style("display", "block");
  };
};
changeMedia(isNarrow); // Call listener function at run time
isNarrow.addListener(changeMedia); // Attach listener function on state changes

// CB Controls vars
var cb1 = d3.select("#cb1");
var cb2 = d3.select("#cb2");
var cb3 = d3.select("#cb3");
var cb4 = d3.select("#cb4");
var cb5 = d3.select("#cb5");
var cb6 = d3.select("#cb6");
var cb7 = d3.select("#cb7");
var cb8 = d3.select("#cb8");
var cb9 = d3.select("#cb9");
var cb10 = d3.select("#cb10");
var cb11 = d3.select("#cb11");
var cb12 = d3.select("#cb12");
var cbn = d3.selectAll(".cbn");

// Slider vars
var interval;
var sliding;
var value = 0;

// Info Panel vars
var info = d3.select("#info");
var infoGraph = d3.select("#info-popgraph");
var nta_clicked = false;

// Story panel vars
var story = d3.select("#storymode");

// Map vars
var start_viz = {
  zoom: 11.75,
  center: [-73.97, 40.755],
  bearing: -2.35,
  pitch: 60.0
};

var start_viz_mobile = {
  zoom: 11.0,
  center: [-73.985, 40.75],
  bearing: -2.35,
  pitch: 60.0
};

var start_stats = {
  center: [-73.98, 40.79],
  zoom: 10.50,
  bearing: 28.5,
  pitch: 0.00
};


var start_story = {
  zoom: 11.75,
  // center: [-73.99, 40.755],
  center: [144.951, -37.818],
  bearing: -2.35,
  pitch: 60.0
};

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/ziyizhang2/ckv2f3zcu3ocs14o5tha20x18",
  center: start_story.center,
  zoom: start_story.zoom,
  maxZoom: 15,
  //minZoom: 10,
  bearing: start_story.bearing,
  pitch: start_story.pitch
});


// Helper Functions
function timeFormatter(t) {
  var dt;
  if(t == 0) dt = '12 AM';
  if(t > 0 && t < 12) dt = t + ' AM';
  if(t == 12) dt = '12 PM';
  if(t > 12) dt = (t-12) + ' PM';
  return dt;
}

function dayFormatterShort(d) {
  var dt;
  if(d == 0) dt = 'MON';
  if(d == 1) dt = 'TUE';
  if(d == 2) dt = 'WED';
  if(d == 3) dt = 'THU';
  if(d == 4) dt = 'FRI';
  if(d == 5) dt = 'SAT';
  if(d == 6) dt = 'SUN';
  return dt;
}


// About Module Callbacks
d3.select("#about-map-button").on("click", function() {
  d3.select("#about").style("display", "none");});

d3.select("#about-close").on("click", function() {
  d3.select("#about").style("display", "none");});

d3.select("#about").on("click", function() {
  d3.select("#about").style("display", "none");});

d3.select("#about-link").on("click", function() {
  d3.select("#about").style("display", "block");
});


// Legend Display callbacks
d3.select("#legend-mobile").on("click", function() {
  
  if (currentMode == "story" || currentMode == "viz") {
    if (d3.select("#legend").style("display") == "none")
      d3.select("#legend").style("display", "block")
    else
      d3.select("#legend").style("display", "none")
  }

  if (currentMode == "stats") {
    if (d3.select("#statslegend").style("display") == "none")
      d3.select("#statslegend").style("display", "block")
    else
      d3.select("#statslegend").style("display", "none")
  }
});


// Build sliders and set callbacks.

var slideTimeCallback = function(evt, value) {
                                    stime = value;
                                    
                                    d3.select("#handle-one-t")
                                       .html(timeFormatter(Math.round(value)));
                                    
                                    if(!sliding) {
                                      sliding = true;
                                      interval = setInterval(function () {
                                                              changeTime({day: sday, time: stime});
                                                              clearInterval(interval);
                                                              sliding = false;
                                                             }, 500);
                                    } 
                                  };

var slideendTimeCallback = function(evt, value) {
                                      sliding = false;
                                      clearInterval(interval);
                                      changeTime({day: sday, time: stime});
                                     };

var slideDayCallback = function(evt, value) {
                                    sday = value;
                                    
                                    d3.select("#handle-one-b")
                                      .html(dayFormatterShort(Math.round(value)));
                                    
                                    if(!sliding) {
                                      sliding = true;
                                      interval = setInterval(function () {
                                                              changeTime({day: sday, time: stime});
                                                              clearInterval(interval);
                                                              sliding = false;
                                                             }, 500);

                                    }
                                  };

var slideendDayCallback = function(evt, value) {
                                      sliding = false;
                                      clearInterval(interval);
                                      changeTime({day: sday, time: stime});
                                     };

var sliderTime = d3.slider().min(0).max(23).step(1).id('t')
                     .on("slide", slideTimeCallback)
                     .on("slideend", slideendTimeCallback);

var sliderDay = d3.slider().min(0).max(6).step(1).id('b')
                     .on("slide", slideDayCallback)
                     .on("slideend", slideendDayCallback);

function getSliders() {

  // TIME
  d3.select('#slider-t').call(sliderTime);

  // DAY
  d3.select('#slider-b').call(sliderDay);

  // Init Slider text.
  d3.select("#handle-one-t").text('12 AM');
  d3.select("#handle-one-b").text('MON');
}

// Change data by time.
function changeTime(settings) {

  time = (settings.time) ? settings.time : 0;
  day = (settings.day) ? settings.day : 0;
  daytime = (day*24 + time).toString();
  daytime_stats = (color_total) ? daytime + "p" : daytime + "d";

  if(map) {

    // VIZ
    map.setPaintProperty("viz",
                         "fill-extrusion-height",
                         ["*", ["get", daytime], 5]);

    map.setPaintProperty("viz",
                          "fill-extrusion-color",
                          {"base": 1,
                           "type": "interval",
                           "property": daytime,
                           "stops": [[0, "#aac9fa"],
                                     [0.01, "#fdd49e"],
                                     [0.02, "#fee8c8"],
                                     [0.04, "#fdbb84"],
                                     [0.08, "#fc8d59"],
                                     [0.16, "#ef6548"],
                                     [0.32, "#d7301f"],
                                     [0.64, "#b30000"],
                                     [0.90, "#7f0000"]],
                           "default": "#800026"});

    if (nta_clicked) 
      updateInfo(infoGraph, neighborhood, day, time);
    else
      updateInfo(infoGraph, "MN", day, time);
  }
}

// Change the map mode.
function changeMode(settings) {

  // Control Legends.
  d3.select("#legend-content").style("display", (settings.id == "viz" || settings.id == "story") ? "block": "none");
  d3.select("#cbs-content").style("display", (settings.id == "viz" || settings.id == "story") ? "block": "none");
  d3.select("#statslegend-content").style("display", (settings.id == "viz" || settings.id == "story") ? "none": "block");

  // Control Sliders.
  if (media == "mobile" && settings.id == "story")
    d3.select("#controls").style("display", "none");
  else
    d3.select("#controls").style("display", "block");

  if (media == "mobile" && settings.id == "stats")
    d3.select("#controls").style("bottom", "140px");
  else
    d3.select("#controls").style("bottom", "30px");

  // Header button attrs.
  vizControl.attr("class", (settings.id == "viz") ? "mode-selected" : "mode");
  statsControl.attr("class", (settings.id == "stats") ? "mode-selected" : "mode");
  storyControl.attr("class", (settings.id == "story") ? "mode-selected" : "mode");

  // Change the map to STATS mode.
  if (settings.id == "stats") {
    
    // Change map view settings.
    if (media == "full") {
      map.flyTo(start_stats);
    } else {
      map.flyTo(start_stats_mobile);
    };

    // Turn on STATS overlays and turn of VIZ overlays.
    map.setLayoutProperty("stats-dimmed", "visibility", "visible");
    map.setLayoutProperty("stats-highlighted", "visibility", "visible");
    map.setLayoutProperty("viz", "visibility", "none");

    // Turn on the info panel.
    info.style("display", "block");

    // Turn off Story panel.
    story.style("display", "none");

    // Set the Info Panel to the default.
    updateInfo(infoGraph, "MN", day, time);
  }

  // Change the map to VIZ mode.
  if (settings.id == "viz") {
    
    // Change the map view settings.
    if (media == "full") map.flyTo(start_viz);
    else map.flyTo(start_viz_mobile);

    // Reset filters.
    d3.select("#cb1").property("checked", true);
    d3.select("#cb2").property("checked", true);
    d3.select("#cb3").property("checked", true);
    d3.select("#cb4").property("checked", true);
    d3.select("#cb5").property("checked", true);
    d3.select("#cb6").property("checked", true);
    d3.select("#cb7").property("checked", true);
    d3.select("#cb8").property("checked", true);
    d3.select("#cb9").property("checked", true);
    d3.select("#cb10").property("checked", true);
    d3.select("#cb11").property("checked", true);
    d3.select("#cb12").property("checked", true);
    d3.select("#cb13").property("checked", true);

    // Update map. TODO:
    map.setFilter('viz', ['in', 'cd', 101, 102, 103, 104, 105, 106,
                          107, 108, 109, 110, 111, 112]);

    // Reset the time.
    changeTime({day: currentDay, time: currentHour});
    slideTimeCallback(d3.event, currentHour);
    slideendTimeCallback(d3.event, currentHour);
    sliderTime.value(currentHour);
    slideDayCallback(d3.event, currentDay);
    slideendDayCallback(d3.event, currentDay);
    sliderDay.value(currentDay);


    // Turn on VIZ overlays and turn off STATS overlays.
    map.setLayoutProperty("viz", "visibility", "visible");
    map.setLayoutProperty("stats-dimmed", "visibility", "none");
    map.setLayoutProperty("stats-highlighted", "visibility", "none");

    // Turn off info panel.
    info.style("display", "none");

    // Turn off Story panel.
    story.style("display", "none");

  }

  // Change the map to STORY mode.
  if (settings.id == "story") {

    // Change map view settings.
    map.flyTo(start_story);

    // Turn on VIZ overlays and turn off STATS overlays.
    map.setLayoutProperty("viz", "visibility", "visible");
    map.setLayoutProperty("stats-dimmed", "visibility", "none");
    map.setLayoutProperty("stats-highlighted", "visibility", "none");

    // Turn on the story panel.
    story.style("display", "block");

    // Turn off info panel.
    info.style("display", "none");

    // Start at the beginning.
    pageNum = 1;
    pageNumbers.text(pageNum + " of " + stories.length);
    backButton.style( "visibility", (pageNum == 1) ? "hidden" : "visible" );
    forwardButton.style( "visibility", (pageNum == stories.length) ? "hidden" : "visible" );
    updateStory(stories[pageNum-1]);
  }

  currentMode = settings.id;
}

// Define map behavior and callback functions.
map.on("load", function(e) {

  // Add VIZ layer.
    /*
  map.addLayer({"id": "viz",
                "type": "fill-extrusion", //3d
                "source": "blocks",
                "source-layer": "trimmin-bx5zqz",
                "paint": {"fill-extrusion-opacity": 0.8,
                          "fill-extrusion-height": ["*", ["get", "0"], 5],
                          "fill-extrusion-height-transition": {duration: 500,
                                                               delay: 0},
                          "fill-extrusion-color": {"base": 1,
                                                   "type": "interval",
                                                   "property": "0",
                                                   "default": "#800026",
                                                   "stops": [[0, "#fff7ec"],
                                                             [10, "#fdd49e"],
                                                             [20, "#fee8c8"],
                                                             [40, "#fdbb84"],
                                                             [80, "#fc8d59"],
                                                             [160, "#ef6548"],
                                                             [320, "#d7301f"],
                                                             [640, "#b30000"],
                                                             [1280, "#7f0000"]]}}});


     */
  // Draw sliders.
  getSliders();

  // Visualization District filters.
  cbn.on("change", function() { 
    
    // Init a set of all districts.
    var filter = new Set([101,102,103,104,105,106,107,108,109,110,111,112]);

    // Add and remove callbacks.
    (cb1.property("checked")) ? filter.add(101) : filter.delete(101);
    (cb2.property("checked")) ? filter.add(102) : filter.delete(102);
    (cb3.property("checked")) ? filter.add(103) : filter.delete(103);
    (cb4.property("checked")) ? filter.add(104) : filter.delete(104);
    (cb5.property("checked")) ? filter.add(105) : filter.delete(105);
    (cb6.property("checked")) ? filter.add(106) : filter.delete(106);
    (cb7.property("checked")) ? filter.add(107) : filter.delete(107);
    (cb8.property("checked")) ? filter.add(108) : filter.delete(108);
    (cb9.property("checked")) ? filter.add(109) : filter.delete(109);
    (cb10.property("checked")) ? filter.add(110) : filter.delete(110);
    (cb11.property("checked")) ? filter.add(111) : filter.delete(111);
    (cb12.property("checked")) ? filter.add(112) : filter.delete(112);

    // Set the filter based on the set.
    map.setFilter('viz', ['in', 'cd'].concat(Array.from(filter)));
  });


    let hoveredStateId = null;

    map.addSource('blocks', {
        'type': 'geojson',
        'data': fp['Financial and Insurance Services']
    });

// The feature-state dependent fill-opacity expression will render the hover effect
// when a feature's hover state is set to true.
    map.addLayer({
        'id': 'block-fills',
        'type': 'fill-extrusion',
        'source': 'blocks',
        'layout': {},
        "paint": {"fill-extrusion-opacity": 0.8,
            "fill-extrusion-height": ["*", ["get", "2002"], 5000],
            "fill-extrusion-height-transition": {duration: 500,
                delay: 0},
            "fill-extrusion-color": {"base": 1,
                "type": "interval",
                "property": "2002",
                "default": "#800026",
                "stops": [[0, "#aac9fa"],
                    [0.01, "#fdd49e"],
                    [0.02, "#fee8c8"],
                    [0.04, "#fdbb84"],
                    [0.08, "#fc8d59"],
                    [0.16, "#ef6548"],
                    [0.32, "#d7301f"],
                    [0.64, "#b30000"],
                    [0.90, "#7f0000"]]}}
    });
    /*
    map.addLayer({
        'id': 'block-fills',
        'type': 'fill',
        'source': 'blocks',
        'layout': {},
        'paint': {
            'fill-color': '#627BC1',
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.5
            ]
        }
    });

    map.addLayer({
        'id': 'block-borders',
        'type': 'line',
        'source': 'blocks',
        'layout': {},
        'paint': {
            'line-color': '#627BC1',
            'line-width': 2
        }
    });

// When the user moves their mouse over the state-fill layer, we'll update the
// feature state for the feature under the mouse.
    map.on('mousemove', 'block-fills', (e) => {
        // window.alert(e.features[0].id);
        if (e.features.length > 0) {
            if (hoveredStateId !== null) {
                map.setFeatureState(
                    { source: 'blocks', id: hoveredStateId },
                    { hover: false }
                );
            }
            hoveredStateId = e.features[0].id;
            map.setFeatureState(
                { source: 'blocks', id: hoveredStateId },
                { hover: true }
            );
        }
    });


// When the mouse leaves the state-fill layer, update the feature state of the
// previously hovered feature.
    map.on('mouseleave', 'block-fills', () => {
        if (hoveredStateId !== null) {
            map.setFeatureState(
                { source: 'blocks', id: hoveredStateId },
                { hover: false }
            );
        }
        hoveredStateId = null;
    });

     */

  map.on('mousemove', (e) => {
    const features = map.queryRenderedFeatures(e.point);

// Limit the number of properties we're displaying for
// legibility and performance
    const displayProperties = [
        'type',
        'properties',
        'id',
        'layer',
        'source',
        'sourceLayer',
        'state'
    ];

    const displayFeatures = features.map((feat) => {
        const displayFeat = {};
        displayProperties.forEach((prop) => {
            displayFeat[prop] = feat[prop];
        });
        return displayFeat;
    });

// Write object as string with an indent of two spaces.
    document.getElementById('features').innerHTML = JSON.stringify(
        displayFeatures,
        null,
        2
    );
  });

  // Initialize app mode.
  if (media == "full") changeMode({id: 'story'});
  if (media == "mobile") changeMode({id: 'viz'});

  // Initialize Story to page one.
  //pageNumbers.text(pageNum + " of " + stories.length);
  //backButton.style( "visibility", (pageNum == 1) ? "hidden" : "visible" );
  //forwardButton.style( "visibility", (pageNum == stories.length) ? "hidden" : "visible" );
  //updateStory(stories[pageNum-1]);

});

// Set default map cursor to a hand.
map.getCanvas().style.cursor = "default";

