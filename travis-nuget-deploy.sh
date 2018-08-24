ApiKey=$1
Source=$2

dotnet pack ./shared
dotnet nuget push ./shared/bin/**/*.nupkg -k $ApiKey -s $Source || echo "Nuget deploy skipped"