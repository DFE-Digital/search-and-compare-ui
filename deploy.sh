#!/bin/bash
set -e

# script for deploying to any environment, choosing the matching deploy password environment variable

# arg 1: environment to deploy to
env=$1

# convert env to uppercase to match environment variable case
upperenv=`echo "$env" | tr '[:lower:]' '[:upper:]'`

eval "password=\$APP_CREDENTIALS_${upperenv}_PWD"

if [ "$env" == "prod" ]; then
  env="prod-2018"
fi

git fetch --unshallow
git push --force https://\$bat-$env-search-and-compare-ui-app:$password@bat-$env-search-and-compare-ui-app.scm.azurewebsites.net:443/bat-$env-search-and-compare-ui-app.git HEAD:refs/heads/master
