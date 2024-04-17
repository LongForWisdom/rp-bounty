# rp-bounty

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/LongForWisdom/rp-bounty/data-update.yml?label=Data%20Update)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/LongForWisdom/rp-bounty/pages%2Fpages-build-deployment?label=Pages%20Deployment)

This is a static site bounty portal that pulls data from a github repository of Rocket Pool bounty data maintained by the Rocket Pool Grants Management Committee.

## Data Flow

Data is pulled into this repository via a periodic github action and a git submodule. The submodule mirrors the content of the GMC data repository. 

The periodic action:
* Sync and Updates the submodule.
* Copies data from the submodule folder into the appropriate folders that are read by jekyll.
* Pulls RSS data from the rocket pool forum.
* Updates the USD/RPL price information from chainlink contracts via infura. 

The github pages build is triggered automatically by changes in the source data.

## Source Assumptions
* That the maintainer will be notified if the skillset set changes. If a new skillset is added in the source data that is not currently present, it will not have a unique icon, but will otherwise behave correctly.
* That the maintainer will be notified if the status set changes. If a new status is added in the source data that is not currently present, it will display without an icon with a black background.
* That the data.yml source data will be kept up-to-date. If not, the countdowns in the top right of the page will not display correctly.

## To Maintain Bounty Content
1. Make a PR with changes to the _data_ respository, located [here](https://github.com/rocketpoolgmc/rocketpool-gmc/tree/main/bounties).
2. Have changes reviewed by another person.
3. Merge changes in _data_ repository.
4. Trigger `data-update` action in _frontend_ repository, located [here](https://github.com/rocketpoolgmc/rp-bounty/actions/workflows/data-update.yml). Alternatively, wait for 24 hour periodic update.
5. Confirm that `data-update` action in _frontend_ repository succeeded and changes were merged.
6. Confirm that `pages-build-deployment` action in _frontend_ repository, located [here](https://github.com/rocketpoolgmc/rp-bounty/actions/workflows/pages/pages-build-deployment) was triggered (automatic) and succeeded.

## Local Development

Follow these steps to setup a local server:

1. Fork the repo
1. Clone it locally
1. Install dependencies: `bundle install`
1. Start the local server: `bundle exec jekyll serve`
1. Go to <http://localhost:4400/> to view changes

To build the site use `bundle exec jekyll build`.

Notes:
* You want Ruby version 2.7 rather than 3+

Resources:
- [Jekyll Docs](https://jekyllrb.com/docs/)
- [Liquid Syntax](https://shopify.github.io/liquid/basics/introduction/)