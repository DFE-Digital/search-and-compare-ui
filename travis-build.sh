#!/usr/bin/env bash
dotnet restore ./src/SearchAndCompareUi.csproj
dotnet restore ./tests/Unit.Tests.csproj
dotnet test ./tests/Unit.Tests.csproj

#Explicily run [Explicit] tests
dotnet test ./tests/Unit.Tests.csproj --filter TestCategory="Integration"
dotnet test ./tests/Unit.Tests.csproj --filter TestCategory="APIs"