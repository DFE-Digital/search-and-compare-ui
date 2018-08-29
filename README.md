# Search and Compare - UI 

[![Build Status](https://travis-ci.com/DFE-Digital/search-and-compare-ui.svg?token=3fqqELBNRC5ecwar1xHq&branch=master)](https://travis-ci.com/DFE-Digital/search-and-compare-ui)

See the [Search and Compare](https://github.com/DFE-Digital/search-and-compare) repo for details if you have access

# Building and Running

## Dotnet SDK
You will need to have Version 2.1.300~2.1.302 of the dotnet SDK installed in order to build and run this. This is due to a bug in ASP.NET MVC Core which is using inconsistent package versions. [The bug](https://github.com/aspnet/Mvc/issues/7969) has a fix promised in .NET Core 2.1.3.  

## Running
Run

    npm install

Runs from command line with `cd src && dotnet run`

Runs from vscode and Visual Studio 2017 with F5.

Defaults to published development API backend to make it easier to get started, override this with an environment variable to work against a local copy of the API or to alter for production environments. E.g.:

Note: The `API_URI` value musn't have a trailing slash.

    cd src && set API_URI=http://localhost:5001/api && dotnet run

## Logging

Logging is configured in `appsettings.json`, and values in there can be overridden with environment variables.

Powershell:

    $env:Serilog:MinimumLevel="Debug"
    dotnet run

Command prompt

    set Serilog:MinimumLevel=Debug
    dotnet run

For more information see:

* https://github.com/serilog/serilog-settings-configuration
* https://nblumhardt.com/2016/07/serilog-2-minimumlevel-override/

Serilog has been configured to spit logs out to both the console
(for `dotnet run` testing & development locally) and Application Insights.

Set the `APPINSIGHTS_INSTRUMENTATIONKEY` environment variable to tell Serilog the application insights key.
