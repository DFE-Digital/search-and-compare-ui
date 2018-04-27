#!/usr/bin/env bash
set -e
dotnet restore ./src/SearchAndCompareUi.csproj
dotnet restore ./tests/SearchAndCompareUI.Tests.csproj
dotnet test ./tests/SearchAndCompareUI.Tests.csproj

#Explicily run [Explicit] tests
dotnet test ./tests/SearchAndCompareUI.Tests.csproj --filter TestCategory="Integration"
dotnet test ./tests/SearchAndCompareUI.Tests.csproj --filter TestCategory="APIs"
