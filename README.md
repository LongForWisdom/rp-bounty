# rp-bounty

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