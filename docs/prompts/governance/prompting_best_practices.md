These prompts are optimized for:

- long documents
- complex technical plans
- multi-file TypeScript projects
- step-by-step implementation
- dependency-based reasoning

Use them exactly as written and they will dramatically improve output quality.

---

# ✅ **1. Use the Document as Your “Context Foundation”**

### **Suggestion**

Reference the implementation plan instead of re-describing requirements.

### **Best Prompt**

> **“Use the attached Beta Implementation Plan as the only source of truth. Do not invent new structures. Now implement the tasks for section **X.Y.Z** exactly as specified, including all acceptance criteria, data models, and file paths.”**

---

# ✅ **2. Pull Specific Sections Only**

### **Suggestion**

Don’t load the entire document — tell the AI _which parts_ to use.

### **Best Prompt**

> **“Only use section **X.Y** and ignore everything else in the document. Generate the full implementation for this section, adhering to the file-level changes and acceptance criteria.”**

This reduces noise and hallucinations.

---

# ✅ **3. Ask for “Delta Output” (minimal changes)**

### **Suggestion**

AI is best at producing diffs, not whole rewrites.

### **Best Prompt**

> **“Using the Beta Implementation Plan, provide *only the diffs* needed to complete task **X.Y.Z**. Show additions, removals, and modified lines for each file using patch-style formatting.”**

---

# ✅ **4. Use the Document as a Test Oracle**

### **Suggestion**

Have AI _validate_ code you wrote, not just generate more.

### **Best Prompt**

> **“Compare this code to the requirements in section **X.Y.Z** of the Beta Implementation Plan. List all missing items, incorrect logic, incomplete validation, or deviations from acceptance criteria.”**

Perfect for code review and sanity checks.

---

# ✅ **5. Ask the AI to Optimize the Workflow**

### **Suggestion**

AI can find ways to reduce time, merge tasks, or simplify design.

### **Best Prompt**

> **“Analyze the Beta Implementation Plan and identify opportunities to reduce engineering overhead. Suggest ways to merge tasks, simplify data structures, or reduce file redundancy. Provide changes grouped by milestone.”**

---

# ✅ **6. Add Unique Section IDs (Make AI Refer Back Better)**

### **Suggestion**

IDs let you reference specific parts.

### **Best Prompt**

> **“Create a new version of this document that adds unique hierarchical IDs to every task, acceptance criterion, and file change. Keep all wording the same, just add identifiers like M0.4.1.1 and B5.3.2.”**

---

# ✅ **7. Add Summaries for Each Section**

### **Suggestion**

AI performs stronger when each section has 2–3 line summaries.

### **Best Prompt**

> **“Rewrite this document by adding a 2–3 sentence overview at the beginning of each section and milestone. Do not modify the content itself—just add concise summaries that explain the goal and expected output.”**

---

# ✅ **8. Create a Rulesheet (centralized mechanics)**

### **Suggestion**

Move all rules into one place for easy access.

### **Best Prompt**

> **“Extract every rule, constraint, karma value, magical limit, drain mechanic, adept power rule, priority table, and creation method requirement from the Beta Implementation Plan. Consolidate them into a new ‘SR5 RULESHEET’ appendix organized by category.”**

---

# ✅ **9. Convert Task Tables Into Machine-Friendly JSON**

### **Suggestion**

AI processes tasks better in structured formats.

### **Best Prompt**

> **For every milestone and task in the document add a JSON array of objects with fields: id, title, description, files, status, dependsOn. Do not drop any detail.”**

---

# ✅ **10. Add Dependency Maps for All Phases**

### **Suggestion**

AI handles dependency reasoning exceptionally well.

### **Best Prompt**

> **“Generate a dependency graph for every phase of the Beta plan. Include creation ordering, required data structures, and dependent components. Format in ASCII and include a machine-readable JSON version.”**

---

# ✅ **11. Create a Prompt Pack Appendix**

### **Suggestion**

Make your workflow repeatable and consistent.

### **Best Prompt**

> **“Append a new ‘Prompt Pack’ section at the end of the document. Include best-practice prompts for: code generation, code review, architecture generation, UI design, dependency analysis, refactoring, and validation checks. Use the plan’s terminology.”**

---

# ✅ **12. Create Glossary for Core Concepts**

### **Suggestion**

AI reasoning improves when terminology is consistent.

### **Best Prompt**

> **“Extract all recurring terminology from the document (CreationState, MergedRuleset, RulesetContext, budgets, free skills, drain stats, tradition mapping, etc.). Generate a Glossary section with precise definitions. Do not alter the underlying meanings.”**

---

# ✅ **13. Turn UI Screens Into Component Trees**

### **Suggestion**

React component hierarchies help AI write cleaner code.

### **Best Prompt**

> **“Transform all UI descriptions for each step (Attributes, Skills, Qualities, Spells, Adept Powers, Traditions) into React component trees, including props, state, and child components. Use TypeScript-React idioms.”**

---

# ✅ **14. Add Example Characters for Edge Cases**

### **Suggestion**

AI writes better rules when it has concrete examples.

### **Best Prompt**

> **“Create 5 sample SR5 characters that test every edge case in the document—magician, adept, technomancer, highly cybered street sam, and street-level runner. Include attributes, skills, spells, gear, karma expenditures, and validation rules triggered.”**

---

# ✅ **15. Create Version 2.0 of the Plan (the most powerful improvement)**

### **Suggestion**

Compress, restructure, de-duplicate, and optimize the document for AI consumption.

### **Ultimate Efficiency Prompt**

> **“Rewrite the entire Beta Implementation Plan into an optimized Version 2.0 structured for AI consumption. Reduce redundancy, consolidate rules into a Rulesheet, convert tasks into JSON, add dependency graphs, include Prompt Packs, and ensure each section is computable and uniquely referenced.”**

This will make future prompting 50–70% more efficient.

---

# ⭐ If you want…

I can **perform ANY of these optimizations for you right now**.

Just tell me:

### **“Do Suggestion #X now”**

or

### **“Do all of them and generate Version 2.0.”**
