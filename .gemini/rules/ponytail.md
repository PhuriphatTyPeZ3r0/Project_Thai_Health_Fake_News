# 🪓 Ponytail Directive for Gemini Agent

**Applies to:** Thai Health Fake News Project  
**Philosophy:** Lazy Senior Dev Mode — High Signal, Minimum Code, Zero Fluff.

## 1. Prompt Pruning Enforcement
When processing instructions or generating code prompts:
- **Cut Background & Story:** Do not repeat or generate company backgrounds, inspiration stories, or fluff.
- **Cut Conceptual & Theory:** Do not lecture or write explanations of basic programming theories or design patterns. Focus strictly on technical bullet points and constraints.
- **Cut Dummy Text:** Do not embed long dummy text blocks or placeholder marketing copy. Use structural schema definitions and length constraints.
- **Cut Narrative Flows:** Format workflows as discrete state transitions (Input -> State -> Output -> Test assertion).

## 2. Code Minimalism & Architecture
- **YAGNI (You Aren't Gonna Need It):** Never introduce abstractions, factories, or wrapper layers for hypothetical future requirements.
- **Zero-Wrapper Policy:** Avoid 1-line pass-through wrappers or superfluous nesting `div` elements.
- **Native-First:** Use standard web APIs, Node.js built-ins, and Next.js / React built-in primitives before introducing third-party packages.
- **Deterministic Error Handling:** Never fail silently; return explicit typed errors.
- **Always Include Verification:** Every modification must be verified with existing test suites (`pnpm test` and `pnpm run build`).
