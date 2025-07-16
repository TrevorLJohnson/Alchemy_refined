# backend/mcp.py

# Disable missing‐import warnings for Pylance
# pyright: reportMissingImports=false

from agents.llm            import llm                # type: ignore
from agents.categorizer    import CategorizerAgent   # type: ignore
from agents.insight        import InsightAgent       # type: ignore
from db                    import SessionLocal       # type: ignore

class MasterControlProgram:
    def __init__(self, agents, db_factory):
        self.agents     = agents
        self.db_factory = db_factory

    def process(self, message_text):
        # 1) Ask the LLM for the assistant reply
        reply = self.agents["categorizer"].llm.ask(message_text)

        # 2) Categorize the message
        cat_result   = self.agents["categorizer"].run(message_text)
        current_cats = cat_result["current"]
        history_cats = cat_result["history"]

        # 3) Generate insights
        insight = self.agents["insight"].run(current_cats)

        # 4) Persist to DB
        from db.models import Message, Category  # type: ignore
        db = self.db_factory()
        msg = Message(content=message_text)
        db.add(msg); db.commit(); db.refresh(msg)
        for cat in current_cats:
            db.add(Category(name=cat, message_id=msg.id))
        db.commit()

        return {
            "reply":      reply,
            "categories": {"current": current_cats, "history": history_cats},
            "insight":    insight
        }


# ---------------------------------------------
# Instantiate agents & export MCP
# ---------------------------------------------
# Pass llm into CategorizerAgent only; InsightAgent takes no args
categorizer_agent = CategorizerAgent(llm=llm)
insight_agent     = InsightAgent()

agents = {
    "categorizer": categorizer_agent,
    "insight":     insight_agent
}

def get_db():
    return SessionLocal()

# Global MCP instance
mcp = MasterControlProgram(agents, get_db)
