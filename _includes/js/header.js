{% assign bounties=site.pages | where:"layout", "bounty" | sort:"date" | reverse | first%}
var mostRecentBountyDate = Date.parse("{{bounties.date}}");
var nextGMCUpdate = Date.parse("2023-12-31");
var nextGMCPayout = Date.parse("2023-12-15");
var nextBountyCutoff = Date.parse("2023-12-10");

document.addEventListener("DOMContentLoaded", function() {
  setRelativeTimeString(mostRecentBountyDate - Date.now(), "bounty-countdown-value");
  setRelativeTimeString(nextGMCUpdate - Date.now(), "bounty-update");
  setRelativeTimeString(nextGMCPayout - Date.now(), "bounty-payout");
  setRelativeTimeString(nextBountyCutoff - Date.now(), "bounty-cutoff");
});

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