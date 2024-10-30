# Base image for running the application - use Linux-compatible image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Build image with Linux-compatible SDK image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["BPR2-T2/BPR2-T2.csproj", "BPR2-T2/"]
RUN dotnet restore "./BPR2-T2/BPR2-T2.csproj"
COPY . .
WORKDIR "/src/BPR2-T2"
RUN dotnet build "./BPR2-T2.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish the application
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./BPR2-T2.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final image for running the application
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BPR2-T2.dll"]
