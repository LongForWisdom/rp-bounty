{% assign bounties=site.pages | where:"layout", "bounty" | sort:"date" | reverse | first%}
var mostRecentBountyDate = Date.parse("{{bounties.date}}");
var nextGMCUpdate = Date.parse("2024-12-31");
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
  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
  const units = ["second", "minute", "hour", "day", "week", "month", "year"];
  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(diff));
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
  
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  return rtf.format(Math.floor(diff / divisor), units[unitIndex]);
}