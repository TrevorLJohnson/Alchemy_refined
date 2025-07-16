# agents/insight.py

class InsightAgent:
    def run(self, categories):
        if not categories:
            return {}

        percent = round(100 / len(categories), 1)
        return {cat: percent for cat in categories}
