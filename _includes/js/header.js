{% assign bounties=site.pages | where:"layout", "bounty" | sort:"creation-date" | reverse | first%}
{% assign dateinfo=site.data.dates %}
var mostRecentBountyDate = Date.parse("{{bounties.creation-date}}");
var dateInfo = JSON.parse('{{dateinfo | jsonify}}');
var rawRPLUSD = JSON.parse('{{site.data.price-responses.rpl-usd | jsonify}}');

document.addEventListener("DOMContentLoaded", function() {
  let dates = getDates();
  setRelativeTimeString(dates.mostRecentBounty - Date.now(), "bounty-countdown-value");
  setRelativeTimeString(dates.nextGMCUpdate - Date.now(), "bounty-update");
  setRelativeTimeString(dates.nextGMCPayout - Date.now(), "bounty-payout");
  setRelativeTimeString(dates.nextBountyCutoff - Date.now(), "bounty-cutoff");
  formatRewards();
  formatTags();
});

function getDates()
{
  let roundsInfo = dateInfo.rounds;
  let dateObject = {};
  dateObject.mostRecentBounty = mostRecentBountyDate;
  let now = new Date();
  now.setDate(now.getDate());
  
  let bestUpdate = new Date();
  let bestPayout = new Date();
  let bestCutoff = new Date();
  
  roundsInfo.sort( (a,b) => b.round - a.round); // reverse order by round
  roundsInfo.forEach(function(round){
    let currentUpdate = Date.parse(round.result);
    let currentPayout = Date.parse(round.payout);
    let currentCutoff = Date.parse(round.end);
    
    if(currentUpdate - now > 0) bestUpdate = currentUpdate;
    if(currentPayout - now > 0) bestPayout = currentPayout;
    if(currentCutoff - now > 0) bestCutoff = currentCutoff;
  });
  
  dateObject.nextGMCUpdate = bestUpdate;
  dateObject.nextGMCPayout = bestPayout;
  dateObject.nextBountyCutoff = bestCutoff;
  
  return dateObject;
}

function setRelativeTimeString(timeDiff, elementId)
{
  document.getElementById(elementId).textContent = getRelativeTimeString(timeDiff);
}

function getRelativeTimeString(diff)
{
  diff /= 1000;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" });
  let parts = rtf.formatToParts(Math.ceil(diff / 86400), "day");
  
  return parts.map(function(part){
    let val = part.value;
    if(part.type === "integer")
    {
      val = "~" + part.value;
    }
    return val
  }).join('');
}

function formatRewards()
{
  let elements = Array.from(document.querySelectorAll('[data-rewardvalue]'));
  let numberFormatUSD = Intl.NumberFormat('en-US', {style: "decimal", maximumFractionDigits: 0 });
  let numberFormatRPL = Intl.NumberFormat('en-US', {style: "decimal", maximumFractionDigits: 2 });
  let RPLprice = parseInt(rawRPLUSD.result, 16) / 10e7;
  
  elements.forEach(function(element)
  {
    let useformat = numberFormatRPL;
    if(element.dataset.convert === "RPL")
    {
      useformat = numberFormatUSD
      element.dataset.rewardvalue = element.dataset.rewardvalue * RPLprice;
    }
    element.innerHTML = useformat.format(element.dataset.rewardvalue);
  });
}

function formatTags()
{
  let elements = Array.from(document.querySelectorAll('[data-format="tag"]'));
  elements.forEach(function(element)
  {
    let unformattedTag = element.innerHTML;
    let formattedTag = "";
    let splitArray = unformattedTag.split('-');
    splitArray.forEach(function(word)
    {
      word = word.trim();
      formattedTag = formattedTag.concat(word[0].toUpperCase(), word.slice(1));
      if(word != splitArray[splitArray.length-1]) {formattedTag = formattedTag.concat(' ');}
    });
    element.innerHTML = formattedTag;
  });
}
