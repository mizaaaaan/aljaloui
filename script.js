(function () {
  'use strict';

  /* ====== QATAR LOCATIONS (lat, lng) ====== */
  var LOCATIONS = [
    { name: 'Hamad International Airport', lat: 25.2609, lng: 51.6138, area: 'Doha' },
    { name: 'Msheireb Downtown', lat: 25.2860, lng: 51.5255, area: 'Doha' },
    { name: 'West Bay', lat: 25.3190, lng: 51.5144, area: 'Doha' },
    { name: 'Lusail City', lat: 25.3650, lng: 51.4890, area: 'Lusail' },
    { name: 'Pearl Qatar', lat: 25.3590, lng: 51.5530, area: 'Doha' },
    { name: 'Katara Cultural Village', lat: 25.3580, lng: 51.5270, area: 'Doha' },
    { name: 'Villaggio Mall', lat: 25.3093, lng: 51.4865, area: 'Doha' },
    { name: 'Mall of Qatar', lat: 25.3025, lng: 51.4380, area: 'Al Rayyan' },
    { name: 'Doha Festival City', lat: 25.3520, lng: 51.4730, area: 'Doha' },
    { name: 'Al Corniche', lat: 25.3050, lng: 51.5100, area: 'Doha' },
    { name: 'Souq Waqif', lat: 25.2885, lng: 51.5305, area: 'Doha' },
    { name: 'Doha Port', lat: 25.2870, lng: 51.5130, area: 'Doha' },
    { name: 'Hamad Medical City', lat: 25.3130, lng: 51.5050, area: 'Doha' },
    { name: 'Al Wakra Hospital', lat: 25.1550, lng: 51.6030, area: 'Al Wakra' },
    { name: 'Al Wakrah', lat: 25.1710, lng: 51.6030, area: 'Al Wakra' },
    { name: 'Al Khor', lat: 25.6860, lng: 51.4970, area: 'Al Khor' },
    { name: 'Salwa Road Wholesale Market', lat: 25.2620, lng: 51.4750, area: 'Doha' },
    { name: 'Industrial Area', lat: 25.2530, lng: 51.4480, area: 'Doha' },
    { name: 'Al Rayyan', lat: 25.2920, lng: 51.4240, area: 'Al Rayyan' },
    { name: 'Education City', lat: 25.3150, lng: 51.4240, area: 'Al Rayyan' },
    { name: 'Dukhan', lat: 25.4160, lng: 50.7890, area: 'Dukhan' },
    { name: 'Ras Laffan', lat: 25.9167, lng: 51.5500, area: 'Ras Laffan' },
    { name: 'Umm Salal', lat: 25.4170, lng: 51.4030, area: 'Umm Salal' },
    { name: 'Al Shamal', lat: 26.1150, lng: 51.2470, area: 'Al Shamal' },
    { name: 'Al Thakira', lat: 25.7200, lng: 51.5030, area: 'Al Khor' },
    { name: 'Al Wukair', lat: 25.1520, lng: 51.5480, area: 'Al Wakra' },
    { name: 'Al Maamoura', lat: 25.2100, lng: 51.5750, area: 'Doha' },
    { name: 'Old Airport', lat: 25.2540, lng: 51.5450, area: 'Doha' },
    { name: 'Fereej Kulaib', lat: 25.2940, lng: 51.4640, area: 'Doha' },
    { name: 'Al Thumama', lat: 25.2200, lng: 51.5050, area: 'Doha' },
    { name: 'Mesaimeer', lat: 25.2250, lng: 51.4450, area: 'Doha' },
    { name: 'Al Mansoura', lat: 25.2790, lng: 51.4950, area: 'Doha' },
    { name: 'Al Hilal', lat: 25.2670, lng: 51.5100, area: 'Doha' },
    { name: 'Al Sadd', lat: 25.2800, lng: 51.4780, area: 'Doha' },
    { name: 'Al Gharafa', lat: 25.3330, lng: 51.4570, area: 'Doha' },
    { name: 'Al Waab', lat: 25.2880, lng: 51.4440, area: 'Doha' },
    { name: 'Fereej bin Mahmoud', lat: 25.3020, lng: 51.4730, area: 'Doha' },
    { name: 'Al Mirqab', lat: 25.2900, lng: 51.5050, area: 'Doha' },
    { name: 'Al Najma', lat: 25.2700, lng: 51.4950, area: 'Doha' },
    { name: 'Al Sadd Stadium', lat: 25.2795, lng: 51.4775, area: 'Doha' }
  ];

  /* ====== PRICING ENGINE ====== */
  var BASE_FARE    = 10;   // QR base charge
  var PER_KM       = 2.0;  // QR per km
  var MIN_FARE     = 20;   // QR minimum
  var BASE_ETA     = 15;   // minutes dispatch + traffic buffer
  var MIN_PER_KM   = 1.2;  // minutes per km city pace

  /* ====== HAVERSINE DISTANCE ====== */
  function haversine(lat1, lon1, lat2, lon2) {
    var R = 6371; // Earth radius in km
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /* ====== DOM REFS ====== */
  var pickupInput    = document.getElementById('pickupInput');
  var pickupList     = document.getElementById('pickupList');
  var pickupAreaTag  = document.getElementById('pickupArea');
  var dropoffInput   = document.getElementById('dropoffInput');
  var dropoffList    = document.getElementById('dropoffList');
  var dropoffAreaTag = document.getElementById('dropoffArea');
  var fareDistanceLabel = document.getElementById('fareDistanceLabel');
  var farePrice      = document.getElementById('farePrice');
  var fareEta        = document.getElementById('fareEta');
  var fareRef        = document.getElementById('fareRef');
  var farePill       = document.querySelector('.fare-pill');
  var fareResult     = document.getElementById('fareResult');
  var estimateBtn    = document.getElementById('estimateBtn');

  var selectedPickup  = null;
  var selectedDropoff = null;
  var activeDropdown  = null;

  /* ====== RENDER LOCATION LIST ====== */
  function renderList(input, listEl, tag, onSelect) {
    var query = input.value.toLowerCase().trim();
    var filtered = LOCATIONS;
    if (query.length > 0) {
      filtered = LOCATIONS.filter(function (loc) {
        return loc.name.toLowerCase().indexOf(query) !== -1 ||
               loc.area.toLowerCase().indexOf(query) !== -1;
      });
    }
    if (filtered.length === 0) {
      listEl.innerHTML = '<li class="loc-empty">No locations found</li>';
    } else {
      listEl.innerHTML = filtered.map(function (loc, i) {
        var origIdx = LOCATIONS.indexOf(loc);
        return '<li data-idx="' + origIdx + '">' +
                 '<span class="loc-name">' + loc.name + '</span>' +
                 '<span class="loc-area">' + loc.area + '</span>' +
               '</li>';
      }).join('');
    }
    listEl.classList.add('open');
    activeDropdown = listEl;

    var items = listEl.querySelectorAll('li[data-idx]');
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-idx'), 10);
        var loc = LOCATIONS[idx];
        input.value = loc.name;
        tag.textContent = loc.area;
        tag.classList.add('visible');
        onSelect(loc);
        listEl.classList.remove('open');
        activeDropdown = null;
        recalcFare();
      });
    });
  }

  /* ====== WIRE INPUTS ====== */
  if (pickupInput) {
    pickupInput.addEventListener('focus', function () {
      renderList(pickupInput, pickupList, pickupAreaTag, function (loc) {
        selectedPickup = loc;
      });
    });
    pickupInput.addEventListener('input', function () {
      renderList(pickupInput, pickupList, pickupAreaTag, function (loc) {
        selectedPickup = loc;
      });
    });
  }

  if (dropoffInput) {
    dropoffInput.addEventListener('focus', function () {
      renderList(dropoffInput, dropoffList, dropoffAreaTag, function (loc) {
        selectedDropoff = loc;
      });
    });
    dropoffInput.addEventListener('input', function () {
      renderList(dropoffInput, dropoffList, dropoffAreaTag, function (loc) {
        selectedDropoff = loc;
      });
    });
  }

  /* close dropdowns on outside click */
  document.addEventListener('click', function (e) {
    if (activeDropdown && !e.target.closest('.loc-picker')) {
      activeDropdown.classList.remove('open');
      activeDropdown = null;
    }
  });

  /* ====== FARE CALCULATION ====== */
  function recalcFare() {
    if (!selectedPickup || !selectedDropoff) return;

    var dist = haversine(
      selectedPickup.lat, selectedPickup.lng,
      selectedDropoff.lat, selectedDropoff.lng
    );
    var km = Math.round(dist * 10) / 10;
    var price = Math.round(Math.max(MIN_FARE, BASE_FARE + PER_KM * km));
    var eta = Math.round(BASE_ETA + MIN_PER_KM * km);

    fareDistanceLabel.textContent = km + ' km — ' + selectedPickup.area + ' → ' + selectedDropoff.area;
    farePrice.textContent = price;
    fareEta.textContent = eta;

    if (farePill) {
      farePill.textContent = 'Estimate Ready';
      farePill.classList.add('ready');
    }
    if (fareResult) {
      fareResult.classList.add('visible');
    }
    if (fareRef) {
      fareRef.textContent = '#AJ-' + (1000 + Math.floor(Math.random() * 9000));
    }
  }

  /* legacy slider fallback (still works if someone kept the old HTML) */
  var slider = document.getElementById('fareDistance');
  if (slider) {
    slider.addEventListener('input', function () {
      var km = parseInt(slider.value, 10);
      var price = Math.round(BASE_FARE + PER_KM * km);
      var eta = Math.round(BASE_ETA + MIN_PER_KM * km);
      fareDistanceLabel.textContent = km + ' km — Anywhere in Qatar';
      farePrice.textContent = price;
      fareEta.textContent = eta;
    });
  }

  /* random ref on load */
  if (fareRef) {
    fareRef.textContent = '#AJ-' + (1000 + Math.floor(Math.random() * 9000));
  }

  /* pre-fill defaults */
  (function () {
    if (pickupInput && !selectedPickup) {
      var defPickup = LOCATIONS.filter(function (l) { return l.name === 'Salwa Road Wholesale Market'; })[0];
      if (defPickup) {
        selectedPickup = defPickup;
        if (pickupAreaTag) { pickupAreaTag.textContent = defPickup.area; pickupAreaTag.classList.add('visible'); }
      }
    }
    if (dropoffInput && !selectedDropoff) {
      var defDrop = LOCATIONS.filter(function (l) { return l.name === 'West Bay'; })[0];
      if (defDrop) {
        selectedDropoff = defDrop;
        if (dropoffAreaTag) { dropoffAreaTag.textContent = defDrop.area; dropoffAreaTag.classList.add('visible'); }
      }
    }
    recalcFare();
  })();



  /* ====== SMOOTH SCROLL FOR NAV ====== */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
