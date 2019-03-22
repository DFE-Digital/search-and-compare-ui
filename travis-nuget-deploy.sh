ApiKey=$1

dotnet pack ./shared
dotnet nuget push ./shared/bin/**/*.nupkg -k $ApiKey -s https://www.nuget.org || echo "Nuget deploy skipped"
