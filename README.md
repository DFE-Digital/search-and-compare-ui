# Search and Compare - UI

[![Build Status](https://travis-ci.com/DFE-Digital/search-and-compare-ui.svg?token=3fqqELBNRC5ecwar1xHq&branch=master)](https://travis-ci.com/DFE-Digital/search-and-compare-ui)

See the [Search and Compare](https://github.com/DFE-Digital/search-and-compare) repo for details if you have access

# Running

Runs from command line with `cd src && dotnet run`

Runs from vscode and Visual Studio 2017 with F5.

Defaults to published development API backend to make it easier to get started, override this with an environment variable to work against a local copy of the API or to alter for production environments. E.g.:

    cd src && set API_URL=http://localhost:5001/ && dotnet run
