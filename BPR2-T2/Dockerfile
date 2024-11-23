# Base image for running the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Build image with SDK image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
ARG AZURE_STORAGE_ACCOUNT
ARG AZURE_STORAGE_ACCESS_KEY
ARG JWT_KEY
ARG JWT_ISSUER
ARG JWT_AUDIENCE
ARG JWT_SUBJECT
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

# Set environment variables for Azure Storage Account and Access Key
ENV AZURE_STORAGE_ACCOUNT=$AZURE_STORAGE_ACCOUNT
ENV AZURE_STORAGE_ACCESS_KEY=$AZURE_STORAGE_ACCESS_KEY
ENV JWT_KEY=$JWT_KEY
ENV JWT_ISSUER=$JWT_ISSUER
ENV JWT_AUDIENCE=$JWT_AUDIENCE
ENV JWT_SUBJECT=$JWT_SUBJECT

ENTRYPOINT ["dotnet", "WebAPI.dll"]
