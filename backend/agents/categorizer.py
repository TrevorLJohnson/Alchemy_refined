from datetime import datetime

class CategorizerAgent:
    def __init__(self, llm):
        self.llm = llm
        self.category_history = []

    def run(self, message):
        prompt = (
            "Categorize the following message into 1–3 high-level topics. "
            "Respond with a comma-separated list only.\n\n"
            f"Message: {message}"
        )
        raw = self.llm.ask(prompt)
        print("DEBUG raw response from LLM:", raw)

        categories = [c.strip() for c in raw.split(",") if c.strip()]
        print("DEBUG parsed categories:", categories)

        # Manual timestamp formatting to avoid platform-specific issues
        now = datetime.now()
        hour = now.hour
        minute = now.minute
        converted_hour = hour % 12 or 12
        minute_str = "{:02d}".format(minute)
        am_pm = "am" if hour < 12 else "pm"
        timestamp = "{}:{}{}".format(converted_hour, minute_str, am_pm)

        entry = {
            "time": timestamp,
            "categories": categories
        }
        self.category_history.append(entry)

        result = {
            "current": categories,
            "history": self.category_history
        }
        print("DEBUG return object from CategorizerAgent.run():", result)
        return result
