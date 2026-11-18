# Multi-Agent Coordination Guidelines (AGENTS.md)

This workspace follows the **Ponytail (Lazy Senior Dev Mode)** standard:

1. **Prompt Pruning:** Reference [Docs/PONYTAIL_PROMPTING.md](file:///C:/Users/iznamu/OneDrive%20-%20Panyapiwat%20Institute%20of%20Management/00_Active_Term/03_1323404_Natural-Language-Processing/03_Projects/Thai_Health_Fake_News/Docs/PONYTAIL_PROMPTING.md) before dispatching subagents or forming prompts. Omit background stories, abstract theory, bloated dummy copy, and narrative text.
2. **Architecture:** Next.js 14 App Router (strictly lowercase `Web/src`) with MVC + OOP design (`IInferenceEngine`).
3. **Quality Gates:** Before closing tasks, verify that:
   - `pnpm --prefix Web test` passes 100% (20/20 test cases).
   - `pnpm --prefix Web run build` compiles with 0 errors.
4. **Git Discipline:** Commit on your assigned feature branch (`feat/6752300313-nextjs-mvc-webapp`). Only push to remote when explicitly requested.
