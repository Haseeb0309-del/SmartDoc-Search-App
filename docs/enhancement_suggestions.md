# Future Enhancement Suggestions

Here are recommended future improvements to enhance the portal:

1. **Hybrid Retrieval**: Combine Keyword BM25 with Vector search using Reranking (e.g. Cohere Rerank) inside Azure AI Search to significantly improve top-1 result relevancy.
2. **Generative Q&A (RAG)**: Integrate Azure OpenAI (GPT-4o) to provide synthesized natural language answers directly above search results.
3. **Advanced Security**: Implement Row-Level Security (RLS) inside Azure AI Search to restrict document visibility based on the user's Active Directory department/role.
