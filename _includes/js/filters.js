var bounties = {{bounties | jsonify}};
var bountyLookup = {};
var sorts = {
  "date-desc": { displayName: "Newest", comparator: function(a,b) { return Date.parse(bountyLookup[b.id].date) - Date.parse(bountyLookup[a.id].date);}},
  "date-asc": { displayName: "Oldest", comparator: function(a,b) { return sorts["date-desc"].comparator(b,a);}},
};


document.addEventListener("DOMContentLoaded", function() {
  bounties.forEach((bounty) => { bountyLookup[bounty.code] = bounty; });
  addSortButtons();
  
  loadParams();
  saveParams(false);
});

addEventListener("popstate", function() {
  location.reload();
  loadParams();
  saveParams(false);
});

function toggleClass(element, cssClass)
{
  document.getElementById(element).classList.toggle(cssClass);
}

function loadParams() {
  
  const params = (new URL(document.location)).searchParams;
  const filters = ["skillset", "status" ,"tag"];
  
  //set sane default.
  if(!params.has("status"))
  {
    params.append("status","open");
  }
  
  for (const [key, value] of params) {
    let values = value.split('+');
    values.forEach(function(value)
    {
      if(filters.includes(key))
      {
        let elementId = "inlineCheckbox-" + key + ":" + value;
        let element = document.getElementById(elementId);
        element.checked = true;
      }
      else if(key == "sort")
      {
        let sortDisplay = document.getElementById("sort-button");
        sortDisplay.dataset.sort = value;
      }
    });
  }
  
  filterBounties(false);
  sortBounties();
}

function saveParams(shouldPushState = true) {
  // Get searchParams
  const prevParams = (new URL(document.location)).searchParams;
  let paramsObject = {};
  Object.assign(paramsObject, prevParams.searchParams);
  
  
  // get filter values
  let selectedFilters = Array.from(document.querySelectorAll('input[name=filter]:checked'));
  if(selectedFilters.length > 0)
  {
    let filterObj = selectedFilters.reduce(function(acc, curr){
      let pair = curr.value.split(':');
      let value = acc[pair[0]] === undefined ? [] : acc[pair[0]];
      value.push(pair[1]);
      acc[pair[0]] = value;
      return acc;
    }, {});
    
    if(filterObj.status !== undefined && filterObj.status.length > 0) paramsObject.status = filterObj.status.join('+');
    if(filterObj.skillset !== undefined && filterObj.skillset.length > 0) paramsObject.skillset = filterObj.skillset.join('+');
    if(filterObj.tag !== undefined && filterObj.tag.length > 0) paramsObject.tag = filterObj.tag.join('+');
  }
  
  //get sort value
  let sortDisplay = document.getElementById("sort-button");
  let sortType = sortDisplay.dataset.sort;
  
  paramsObject.sort = sortType;
  
  const newParams = new URLSearchParams(paramsObject);
  if((newParams != prevParams) && shouldPushState === true)
  {
    history.pushState("", "", '?' + newParams);
  }
}

// filter resources to only ones with all checked categories
function filterBounties() {
  // get a list of checked filters
  let allFilters = Array.from(document.querySelectorAll('input[name=filter]'));
  let selectedFilters = Array.from(document.querySelectorAll('input[name=filter]:checked'));
  let searchFilter = document.getElementById("search-input");
  let selectedStatuses = [];
  let selectedSkillsets = [];
  let selectedTags = [];  
  
  selectedFilters.forEach(function(input)
  {
    let value = input.value;
    let pair = value.split(':');
    switch(pair[0])
    {
      case "status":
        selectedStatuses.push(pair[1]);
      break;
      case "skillset":
        selectedSkillsets.push(pair[1]);
      break;
      case "tag":
        selectedTags.push(pair[1]);
      break;
    }
  });

  let searchInput = searchFilter.value.toLowerCase();

  let acc = 0;

  let items = document.getElementsByClassName("bounty-item-container");
  for (let i = 0; i < items.length; i++) {
    let show = true;
    let bounty = bounties.find((bounty) => bounty.code === items[i].id);
    
    show &= selectedStatuses.includes(bounty.status) || selectedStatuses.length === 0;
    
    if(selectedSkillsets.length > 0)
    {
      let skillsetShow = false;
      bounty.skillsets.forEach((bountySkillset) => skillsetShow |= selectedSkillsets.includes(bountySkillset));
      show &= skillsetShow;
    }
    
    if(selectedTags.length > 0)
    {
      if(bounty.tags !== null && bounty.tags.length !== 0)
      {
        let tagShow = false;
        bounty.tags.forEach((bountyTag) => tagShow |= selectedTags.includes(bountyTag));
        show &= tagShow;
      }
      else
      {
        show = false;
      }
    }
    
    if(searchInput !== null && searchInput !== "")
    {
      let lowercaseTitle = bounty.title.toLowerCase();
      let lowercaseSummary = bounty.summary.toLowerCase();
      if(lowercaseTitle.includes(searchInput) ||
         lowercaseSummary.includes(searchInput))
      {
        show &= true;
      }
      else
      {
        show = false;
      }
    }
      
    
    if(show)
    {
      items[i].classList.remove("bounty-item-anim-hide");
      acc++;
    }
    else
    {
      items[i].classList.add("bounty-item-anim-hide");
    }
  }
  
  
  let counter = document.getElementById("filter-count");
  counter.textContent = acc + " matching bounties";
  
}

function addSortButtons()
{
  let sortDisplay = document.getElementById("sort-button");
  let sortDropdown = document.getElementById("sort-dropdown");
  Object.keys(sorts).forEach( key => {
    let sortButton = document.createElement("button");
    sortButton.onclick = function(){ sortDisplay.dataset.sort = key; sortBounties(); saveParams(); sortDisplay.click();};
    sortButton.dataset.sort = key;
    sortButton.textContent = sorts[key].displayName;
    sortButton.classList.add("sort-dropdown-button");
    sortDropdown.appendChild(sortButton);
  });
}

function sortBounties()
{
  let elements = document.getElementsByClassName("bounty-item-container");
  let parent = document.getElementById("bounty-list");
  let sortDisplay = document.getElementById("sort-button");
  let elementArray = Array.from(elements);
  let sortType = sortDisplay.dataset.sort;

  let sorted = elementArray.sort(sorts[sortType].comparator);
  sorted.forEach((item) => { parent.appendChild(item);});
  sortDisplay.textContent = "Sort By: " + sorts[sortType].displayName;
}