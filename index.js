var request = require('request');
var cheerio = require('cheerio');

function yearParamsToFields(yearsString) {
  yearsString.substr(yearsString.indexOf('_1996')+'_1996'.length);
  var fields = yearsString.split('_').slice(2);
  for (var i=0; i < fields.length; i++) {
    fields[i] = fields[i].split(':');
  }
  return fields;
}

function getWayBackUrl(website, year) {
  if (!year) { year = ''; }
  return 'http://wayback.archive.org/web/' + year + '*/' + website;
}

function getSnapshots($, cb) {
  var snapshots = [];
  $('#wbCalendar .month').each(function(){
    this.find('.pop').each(function(){
      snapshots.push({
        date: new Date(this.find('h3').text().trim()),
        url: this.find('li:first-child a').attr('href')
      });
    });
  });
  cb(snapshots);
}

function getActiveYears(url, cb) {
  request(getWayBackUrl(url), function(error, response, body) {
    if (error || response.statusCode != 200) {
      return;
    }
    var $ = cheerio.load(body);
    var activeYears = [];
    var years = yearParamsToFields($('#sparklineImgId').attr('src'));
    for (var i=0; i < years.length; i++) {
      if (years[i][2]-0 > 0) {
        activeYears.push(years[i][0]-0);
      }
    }
    cb(activeYears);
  });
}

function getYearSnapshots(url, cb) {
  request(url, function(error, response, body) {
    if (error || response.statusCode != 200) {
      return cb(error || 'HTTP status: ' + response.statusCode);
    }
    getSnapshots(cheerio.load(body), cb);
  });
}

module.exports = function getAllSnapshots(url, cb) {
  getActiveYears(url, function(activeYears){
    var allSnapshots = [];
    var completedIndex = activeYears.length;
    for (var j=0; j < activeYears.length; j++) {
      getYearSnapshots(getWayBackUrl(url, activeYears[j]), function(snapshots){
        completedIndex--;
        allSnapshots = allSnapshots.concat(snapshots);
        if (completedIndex == 0) {
          allSnapshots.sort(function(a, b){ return a.date - b.date; });
          cb(allSnapshots);
        }
      });
    }
  });
};
