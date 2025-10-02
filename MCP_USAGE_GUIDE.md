# MCP Servers Usage Guide

This project has been configured with 3 MCP servers to enhance your development workflow:

## 1. Knowledge Graph (mcp-knowledge-graph)

### Purpose
Maintains a local knowledge graph to store and retrieve project knowledge before and after tasks.

### Auto-approved Operations
The following operations are auto-approved for seamless integration:
- `aim_create_entities` - Create new entities in the knowledge graph
- `aim_create_relations` - Create relationships between entities
- `aim_read_memories` - Read stored memories/knowledge
- `aim_query_memories` - Query the knowledge graph
- `aim_list_databases` - List available databases

### Usage Pattern
**Before starting any task:**
```
Read relevant knowledge from the knowledge graph about this task
```

**After completing any task:**
```
Store what was learned and accomplished in the knowledge graph
```

### Storage Location
Knowledge is stored locally in `.aim/` directory in this project.

## 2. Context7 (@upstash/context7-mcp)

### Purpose
Provides up-to-date, version-specific documentation and best practices for finding the proper way to implement things.

### Usage
Add `use context7` to any prompt where you want current documentation and best practices:

```
Create a Next.js 14 project with routing and server components. use context7

Write a MongoDB aggregation pipeline to group and sort documents. use context7

How should I handle authentication in React? use context7
```

### Benefits
- Real-time access to current documentation
- Version-specific code examples
- Best practices and patterns
- Eliminates outdated code references

## 3. Sequential Thinking (@modelcontextprotocol/server-sequential-thinking)

### Purpose
Breaks down complex problems into manageable steps and provides deep, structured thinking.

### Trigger Phrase
When you want deep sequential analysis, say:
```
"think sequentially think hard"
```

### Features
- Breaks complex problems into manageable steps
- Revises and refines thoughts as understanding deepens
- Branches into alternative reasoning paths
- Provides structured problem-solving approach

## Workflow Integration

### Recommended Task Flow
1. **Start Task**: Query knowledge graph for relevant background
2. **Research**: Use context7 for current best practices
3. **Complex Problems**: Use "think sequentially think hard" for deep analysis
4. **End Task**: Store learnings and results in knowledge graph

### Example Workflow
```
Before implementing feature X:
1. Query knowledge graph: "What do we know about similar features?"
2. Get best practices: "How to implement feature X properly? use context7"
3. For complex logic: "think sequentially think hard about the architecture"
4. After completion: Store implementation details and lessons learned
```

## Configuration Files
- MCP configuration: `.mcp.json`
- Knowledge graph storage: `.aim/`
- All servers configured with project scope for team sharing

## Commands
- List MCP servers: `claude mcp list`
- Reset project choices: `claude mcp reset-project-choices`
- Get server details: `claude mcp get <server-name>`