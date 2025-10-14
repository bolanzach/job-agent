import os
from typing import Optional, Protocol
from abc import ABC, abstractmethod
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()


class LLMClient(ABC):
    """Abstract base class for LLM clients"""

    @abstractmethod
    def generate_completion(
            self,
            prompt: str,
            max_tokens: int = 1000,
            temperature: float = 0.7,
            advanced: bool = False
    ) -> str:
        pass


class ClaudeClient(LLMClient):
    """Claude/Anthropic implementation"""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable not set")
        self.client = Anthropic(api_key=self.api_key)
        self.model = os.getenv("LLM_MODEL_BASIC")

    def generate_completion(
            self,
            prompt: str,
            max_tokens: int = 1000,
            temperature: float = 0.7,
            advanced: bool = False
    ) -> str:
        response = self.client.messages.create(
            model=self.model if not advanced else os.getenv("LLM_MODEL_ADVANCED"),
            max_tokens=max_tokens,
            temperature=temperature,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return response.content[0].text


class MockClient(LLMClient):
    """Mock implementation for testing"""

    def generate_completion(
            self,
            prompt: str,
            max_tokens: int = 1000,
            temperature: float = 0.7,
            advanced: bool = False
    ) -> str:
        return f"Mock response for prompt: {prompt[:50]}..."


def get_llm_client(provider: Optional[str] = None) -> LLMClient:
    """Factory function to get appropriate LLM client"""
    provider = provider or os.getenv("LLM_PROVIDER", "claude")

    if provider == "claude":
        return ClaudeClient()
    elif provider == "mock":
        return MockClient()
    else:
        raise ValueError(f"Unknown LLM provider: {provider}")


# Default client instance
llm_client = get_llm_client()
