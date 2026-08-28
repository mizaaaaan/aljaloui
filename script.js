(function(){
  var slider = document.getElementById('fareDistance');
  var distLabel = document.getElementById('fareDistanceLabel');
  var priceEl = document.getElementById('farePrice');
  var etaEl = document.getElementById('fareEta');
  var refEl = document.getElementById('fareRef');

  var BASE_FARE = 5;   // QR
  var PER_KM = 2;       // QR per km
  var BASE_ETA = 10;    // minutes dispatch + traffic buffer
  var MIN_PER_KM = 1.8; // minutes per km, city pace

  function update(){
    var km = parseInt(slider.value, 10);
    var price = Math.round(BASE_FARE + PER_KM * km);
    var eta = Math.round(BASE_ETA + MIN_PER_KM * km);
    distLabel.textContent = km + ' km — Anywhere in Doha';
    priceEl.textContent = price;
    etaEl.textContent = eta;
  }

  if(slider){
    slider.addEventListener('input', update);
    update();
  }
  if(refEl){
    refEl.textContent = '#AJ-' + (1000 + Math.floor(Math.random()*9000));
  }
})();
