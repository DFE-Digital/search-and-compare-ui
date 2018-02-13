#!/usr/bin/env bash
set -e
curl -k -X POST --data-binary "{\"git\":{\"ref\":\"$TRAVIS_BRANCH\",\"commit\":\"$TRAVIS_COMMIT\"}}" -H "Content-Type: application/json" $1