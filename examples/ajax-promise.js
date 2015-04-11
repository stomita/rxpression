var Rx = require('rx');
var jsdom = require('jsdom');
var win = jsdom.jsdom().parentWindow;
var $ = require('jquery')(win);
XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
$.support.cors = true;
$.ajaxSettings.xhr = function() { return new XMLHttpRequest(); };
$('body').html('<input id="state" type="text">');

var Rxpression = require('../');

var stateSelect = $('<select><option>CA</option><option>TX</option><option>OR</option></select>');
$('body').append(stateSelect);
var context = {
  listAllCounty: function(state) {
    return $.getJSON('http://api.sba.gov/geodata/county_links_for_state_of/' + state + '.json').promise();
  },
  state: Rx.Observable.fromEvent(stateSelect, 'change')
};

var rxpr = new Rxpression('listAllCounty(state.target.value).length');
rxpr.evaluate(context).take(3).subscribe(function(result) {
  console.log('state conties: ', result); // 58, 84, 32
}, function(err) {
  console.error('error: ', err);
}, function() {
  console.log('completed');
});

var states = [ 'CA', 'TX', 'OR' ]
var PID = setInterval(function() {
  stateSelect.val(states.shift());
  stateSelect.trigger('change');
  if (states.length === 0) { clearInterval(PID); }
}, 2000)
