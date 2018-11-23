# Search and Compare - UI

[![Build Status](https://travis-ci.com/DFE-Digital/search-and-compare-ui.svg?token=3fqqELBNRC5ecwar1xHq&branch=master)](https://travis-ci.com/DFE-Digital/search-and-compare-ui)

See the [Search and Compare](https://github.com/DFE-Digital/search-and-compare) repo for details if you have access

# Building and Running

## Dotnet SDK

You will need to have Version 2.1.5 of the dotnet SDK installed in order to build and run this.

## Running

Run

    cd src
    npm install

Runs from vscode and Visual Studio 2017 with F5.

Runs from command line with `cd src && dotnet run`

    cd src
    dotnet run

Defaults to published development API backend to make it easier to get started, override this with an environment variable to work against a local copy of the API or to alter for production environments. E.g.:

    cd src
    set API_URL=http://localhost:5001 && dotnet run

### Set maps config

    dotnet user-secrets set google_cloud_platform_key_geocoding [the-key]
    dotnet user-secrets set google_cloud_platform_key_maps [the-key]

## Logging

Logging is configured in `appsettings.json`, and values in there can be overridden with environment variables.

Powershell:

    $env:Serilog:MinimumLevel="Debug"
    dotnet run

Command prompt

    set Serilog:MinimumLevel=Debug
    dotnet run

For more information see:

- https://github.com/serilog/serilog-settings-configuration
- https://nblumhardt.com/2016/07/serilog-2-minimumlevel-override/

Serilog has been configured to spit logs out to both the console
(for `dotnet run` testing & development locally) and Application Insights.

Set the `APPINSIGHTS_INSTRUMENTATIONKEY` environment variable to tell Serilog the application insights key.

## Running the JS unit tests

To run the JS unit tests (full suite, with coverage output):

```bash
cd src
npm install
npm test
```

To run in watch mode (which also allows you to specify grep patterns to focus only on certain specs/suites, but without coverage output):

```bash
npm run test:watch
```
## Shutting down the service and showing the off line page.
Rename the file "app_offline.htm.example" in the root folder to "app_offline.htm"
