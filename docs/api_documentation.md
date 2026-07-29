# Backend REST API Documentation

The REST API backend is written in Python (Flask) and exposes endpoints for search, predictive document classification, authentication, and index administration.

## API Endpoints

### 1. `POST /search`
- **Description**: Query the AI Search index. Tries Azure AI Search first; falls back to local Sentence-Transformers.
- **Request Body**:
  ```json
  {
    "query": "VPN access guidelines",
    "filters": ["IT"],
    "top": 10,
    "page": 1,
    "sort": "relevance"
  }
  ```
- **Response**:
  ```json
  {
    "results": [
      {
        "id": "it-1",
        "text": "...",
        "category": "IT",
        "snippet": "...",
        "score": 0.985,
        "source": "azure"
      }
    ],
    "count": 1,
    "total": 1,
    "page": 1,
    "azure": true
  }
  ```

### 2. `POST /autocomplete`
- **Description**: Retrieve autocomplete suggestions for partial search queries.
- **Request Body**:
  ```json
  {
    "query": "vp",
    "top": 5
  }
  ```
- **Response**:
  ```json
  {
    "suggestions": ["vpn setup guide", "vpn connection troubleshooting"]
  }
  ```

### 3. `POST /predict`
- **Description**: Run the scikit-learn LinearSVC classifier to auto-tag a document snippet with its category (HR, IT, or Finance).
- **Request Body**:
  ```json
  {
    "text": "How do I request a software license or purchase new dev tools?"
  }
  ```
- **Response**:
  ```json
  {
    "category": "IT",
    "success": true
  }
  ```

### 4. `POST /register` & `POST /login`
- **Description**: User registration and login endpoints utilizing SQLite and SHA-256 password hashing.

### 5. `GET /azure/status`
- **Description**: Check the health and document counts of the configured Azure AI Search Index.

### 6. `POST /azure/bulk-import`
- **Description**: Admin-only route to upload all local preprocessed documentation into the Azure AI Search index in one batch.
