FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/Mrp.Api/Mrp.Api.csproj", "src/Mrp.Api/"]
COPY ["src/Mrp.Core/Mrp.Core.csproj", "src/Mrp.Core/"]
COPY ["src/Mrp.Engine/Mrp.Engine.csproj", "src/Mrp.Engine/"]
COPY ["src/Mrp.Infrastructure/Mrp.Infrastructure.csproj", "src/Mrp.Infrastructure/"]
COPY ["src/Mrp.AI/Mrp.AI.csproj", "src/Mrp.AI/"]
COPY ["src/Mrp.Optimization/Mrp.Optimization.csproj", "src/Mrp.Optimization/"]
RUN dotnet restore "src/Mrp.Api/Mrp.Api.csproj"

COPY . .
WORKDIR "/src/src/Mrp.Api"
RUN dotnet build "Mrp.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Mrp.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Mrp.Api.dll"]
