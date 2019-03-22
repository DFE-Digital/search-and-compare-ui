#!/usr/bin/env bash
set -e

dotnet pack ./shared
dotnet nuget push ./shared/bin/**/*.nupkg -k $NUGET_API_KEY -s https://www.nuget.org || echo "Nuget deploy skipped"
