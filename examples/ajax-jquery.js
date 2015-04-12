var Rx = require('rx');
var jsdom = require('jsdom');
var win = jsdom.jsdom().parentWindow;
var $ = require('jquery')(win);
XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
$.support.cors = true;
$.ajaxSettings.xhr = function() { return new XMLHttpRequest(); };

var Rxpression = require('../');

$('body').html(
  '<select id="state">'+
    '<option>CA</option>'+
    '<option>TX</option>'+
    '<option>OR</option>'+
  '</select>'
);
var stateSelect = $('#state');
var context = {
  listAllCounty: function(state) {
    var url = 'http://api.sba.gov/geodata/county_links_for_state_of/' + state + '.json';
    return $.getJSON(url).promise();
  },
  state: Rx.Observable.fromEvent(stateSelect, 'change')
};

// List counties for selected state in the UnitedStates
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
