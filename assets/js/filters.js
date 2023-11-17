<script>
var bounties = {{bounties | jsonify}};


document.addEventListener("DOMContentLoaded", function() {
  loadFilters();
  filterBounties();
});

function loadFilters() {
  
  const params = (new URL(document.location)).searchParams;
  
    console.log("load");
    console.log(params);
    for (const [key, value] of params) {
    
    let values = value.split('+');
    console.log(values);
    values.forEach(function(value)
    {
      let elementId = "inlineCheckbox-" + key + ":" + value;
      console.log(elementId);
      let element = document.getElementById(elementId);
      element.checked = true;
    });
  }
  
}

// filter resources to only ones with all checked categories
function filterBounties() {
  // get a list of checked filters
  let allFilters = Array.from(document.querySelectorAll('input[name=filter]'));
  let selectedFilters = Array.from(document.querySelectorAll('input[name=filter]:checked'));
  let selectedStatuses = [];
  let selectedSkillsets = [];
  let selectedTags = [];  
  let paramsObject = {};
  
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
  
  if(selectedStatuses.length > 0) paramsObject.status = selectedStatuses.join('+');
  if(selectedSkillsets.length > 0) paramsObject.skillset = selectedSkillsets.join('+');
  if(selectedTags.length > 0) paramsObject.tag = selectedTags.join('+');

  const params = new URLSearchParams(paramsObject);
  history.pushState("", "", '?' + params);

    var items = document.getElementsByClassName("bounty-item-container");
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
      items[i].style.display = show ? "block" : "none";
    }
}
</script>