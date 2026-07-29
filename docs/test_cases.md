# System Test Cases Document

This document strictly follows the TCS iON Industry Project Test Case Specification template.

## Test Cases Matrix

| Test Case # | Test Case Description | Application / Screen for searching | Test Step | Test Step Description | Expected Result | Pre-Requisites | Test Data |
|---|---|---|---|---|---|---|---|
| TC01 | Validate natural language search intent processing for remote access guidelines | Search Portal / Main Dashboard | # 1 | Type "VPN setup guide" in search bar and press Enter | Search result displays "VPN Setup Guide" and "IT Security Guidelines" as top relevant documents | Policy documents indexed in local search index / Azure AI Search index, backend online | Query: "VPN setup", Category: "IT", Page: 1 |
| TC02 | Validate live query autocomplete and phrase suggestion | Search Bar / Instant Dropdown | # 2 | Focus search input and type "work" | Dropdown overlay displays autocomplete suggestions like "working hours standard working" and "work eligible employees may" | Autocomplete endpoint `/autocomplete` active, search index pre-loaded | Input: "work", Top: 5 |
| TC03 | Validate search result sorting by modification date and relevance score | Search Results Screen | # 3 | Click Sort dropdown and select "Date Updated" | Search result cards re-order dynamically by last updated timestamp, latest documents first | Search results populated on screen with valid date metadata | Sort Option: "date", Filter: All |
| TC04 | Validate search result pagination and page offset navigation | Search Results Footer | # 4 | Click "Next" pagination button | System fetches next batch of 10 search results, updating page numbers and scroll focus | Total search matches exceed 10 documents for given query | Query: "policy", Page: 2, Top: 10 |
| TC05 | Validate document detail view text export and file download | Document Detail Screen | # 5 | Open policy document detail modal and click "Download .txt" | A plain text file containing formatted policy title, category, and text content downloads to disk | User viewing active document detail modal | Doc ID: "hr-2", Title: "Remote Work Policy" |
| TC06 | Validate ML document classifier category prediction accuracy | Admin Dashboard / ML Panel | # 6 | Submit policy snippet to `/predict` ML classification endpoint | Classifier returns category "IT" with high confidence score and success flag | Trained TF-IDF + LinearSVC model (`smart_doc_classifier.pkl`) loaded in server | Text: "Cisco AnyConnect VPN setup and configuration" |
| TC07 | Validate user account registration and login authentication | Auth Portal / Sign In Screen | # 7 | Enter name, email, password in registration form and submit | User account created in SQLite DB (`users.db`), redirected to sign-in, login succeeds | SQLite database initialized, server running on port 5000 | Email: "employee@nexussolutions.in", Password: "securepass123" |
