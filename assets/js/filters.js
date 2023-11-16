<script>
var bounties = {{bounties | jsonify}};

// filter resources to only ones with all checked categories
function filterBounties() {
  // get a list of checked filters
  let checkboxes = Array.from(document.querySelectorAll('input[name=filter]:checked'));
  let selectedStatuses = [];
  let selectedSkillsets = [];
  let selectedTags = [];
  
  checkboxes.forEach(function(checkbox)
    {
      let value = checkbox.value;
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