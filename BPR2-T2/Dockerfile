# Base image for running the application - use Linux-compatible image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Build image with Linux-compatible SDK image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy project files
COPY ["Application/Application.csproj", "Application/"]
COPY ["Domain/Domain.csproj", "Domain/"]
COPY ["EfcDataAccess/EfcDataAccess.csproj", "EfcDataAccess/"]
COPY ["WebAPI/WebAPI.csproj", "WebAPI/"]

# Restore dependencies
RUN dotnet restore "./WebAPI/WebAPI.csproj"

# Copy the rest of the files and build the application
COPY . .
WORKDIR "/src/WebAPI"
RUN dotnet build "./WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish the application
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final image for running the application
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Copy the SQLite database file into the container
COPY ["EfcDataAccess/Reservation.db", "/app/"]
RUN chmod 666 /app/Reservation.db

ENTRYPOINT ["dotnet", "WebAPI.dll"]
