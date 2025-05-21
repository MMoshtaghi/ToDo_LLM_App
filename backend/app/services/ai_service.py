from app.config.config import settings


def get_llm():
    from langchain_google_genai import ChatGoogleGenerativeAI
    # For now we use the only one model
    return ChatGoogleGenerativeAI(model=settings.VALID_GEMINI_MODELS[0], google_api_key=settings.GEMINI_API_KEY)


class AIService:
    def __init__(self):
        self.llm = get_llm()

    def text_to_task(self, text:str):
        # TODO How to reliably convert relative time in natural language (e.g. Next Monday, 2nd Monday of next month) to datatime
        raise NotImplementedError("text to task is not implemented")
    
    def bulk_summarizer(self):
        raise NotImplementedError("bulk summarizer is not implemented")
     
    def smart_tagging(self, task_id:int):
        """the LLM assigns priority/labels/tags based on the task description."""
        raise NotImplementedError("smart tagging is not implemented")