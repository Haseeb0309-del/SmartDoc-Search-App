# Azure Static Web App & Search Deployment Guide

## Prerequisites
- Azure subscription with access to Azure AI Search.
- Azure CLI or Azure Portal access.

## Step 1: Provision Azure AI Search
1. In the Azure Portal, create a new **Azure AI Search** resource.
2. Choose your preferred region and pricing tier (e.g., Free, Basic, or Standard).
3. Under the **Keys** tab, retrieve the **Primary Admin Key** and the **Search URL (Endpoint)**.

## Step 2: Configure Environment Variables
Create or modify the `.env` file in the root of the project with the following values:
```ini
AZURE_SEARCH_ENDPOINT=https://your-search-service-name.search.windows.net
AZURE_SEARCH_API_KEY=your-azure-search-api-key
AZURE_SEARCH_INDEX=documents
AZURE_SEARCH_SEMANTIC_CONFIG=sem-config
AZURE_SEARCH_API_VERSION=2023-11-01
```

## Step 3: Populate and Index Documents
Run the bulk upload tool to push local preprocessed documents into your Azure AI Search Index:
1. Start your local Flask server:
   ```bash
   python server.py
   ```
2. Log into the Portal, navigate to the **Admin** dashboard, and click **Bulk Import to Azure**. This executes a `mergeOrUpload` batch operation on the Azure Search service.

## Step 4: Deploying to Azure Static Web Apps (SWA)
1. Commit the project repository to GitHub.
2. In the Azure Portal, search for and create a new **Static Web App**.
3. Link your GitHub repository and select the branch (e.g., `main`).
4. Select the build preset **Vite**.
5. Set the App location as `/` and leave Api location blank (if configuring routing proxies or integrating with Azure Functions).
6. Click **Review + Create**.
7. In the Static Web App configuration settings in Azure, add your Environment Variables under **Application Settings** for production.
