# System Test Scenarios Document

This document strictly follows the TCS iON Industry Project Test Scenario Specification template.

## Test Scenarios Matrix

| Req Id | Test Scenario Id | Application /Screen | High Level Test Conditions | Expected Results | Priority |
|---|---|---|---|---|---|
| REQ01 | TS01 | Login/Register Screen | User submits valid credentials (email & password) on authentication portal | Login succeeds, JWT session established, user redirected to employee self-service dashboard | High |
| REQ02 | TS02 | Search Bar / Autocomplete | User types natural language query terms into search input | Dropdown overlay displays real-time autocomplete suggestions matching indexed policy content | High |
| REQ03 | TS03 | Search Results Dashboard | User submits complex natural language or synonym query | Engine returns relevant policy documents sorted by vector similarity score and highlights snippets | High |
| REQ04 | TS04 | Search Results Dashboard | User selects category filter (HR, IT, Finance) or changes sort option | Results list dynamically filters and re-orders by selected category and timestamp/relevance | Medium |
| REQ05 | TS05 | Search Results Footer | Search results query returns > 10 policy document matches | Pagination controls enable Next/Previous navigation across result pages (10 items per page) | Medium |
| REQ06 | TS06 | Document Detail View | User clicks on a search result card and selects "Download .txt" | Full document contents download as formatted text file (`.txt`) to local device | High |
| REQ07 | TS07 | Admin Control Panel | Admin user views system health, index status, and user registry | Admin panel displays active server health, Azure index statistics, document count, and user table | Medium |
| REQ08 | TS08 | ML Classifier Engine | User or system passes document snippet to `/predict` endpoint | Trained ML model accurately predicts document category (HR, IT, Finance) with high precision | High |
