"""
AI Chat endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from uuid import UUID
import openai

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.schemas.medical import ChatMessage, ChatResponse
from app.models.medical import ChatHistory

router = APIRouter()

# Initialize OpenAI client
openai_client = None
if settings.OPENAI_API_KEY:
    openai_client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


# System prompts for different chat types
SYSTEM_PROMPTS = {
    "nutrition": """You are a specialized nutrition assistant for rural communities in India. Your expertise includes:

CONTEXT & FOCUS:
- Rural health and nutrition challenges
- Affordable, local ingredients (millets, dal, seasonal vegetables)
- Traditional Indian cooking methods and recipes
- Limited healthcare access and budget constraints
- Cultural food preferences and dietary restrictions

RESPONSE GUIDELINES:
- Provide practical, actionable advice
- Use affordable, locally available ingredients
- Include specific quantities, costs (in ₹), and preparation times
- Consider limited kitchen facilities and cooking fuel
- Offer traditional remedies backed by nutrition science
- Be culturally sensitive and region-appropriate
- Keep language simple but informative
- Always provide safety disclaimers for medical conditions

SPECIALIZATIONS:
- Diabetes management with local foods
- Child nutrition and growth
- Maternal health and pregnancy nutrition
- Weight management for rural lifestyles
- Anemia and micronutrient deficiency
- Budget meal planning (₹20-100 per family meal)
- Seasonal eating and food preservation
- Kitchen gardening and sustainable nutrition

Always prioritize safety and recommend consulting healthcare providers for serious medical conditions.""",

    "medical": """You are a helpful medical information assistant for DIETEC health app. You provide:

IMPORTANT DISCLAIMERS:
- You are NOT a replacement for professional medical advice
- Always recommend consulting a doctor for serious symptoms
- Provide general health information only

CAPABILITIES:
- Explain common medical conditions in simple terms
- Describe typical symptoms and when to seek help
- Provide first aid information
- Explain medication general information
- Help users prepare questions for doctor visits
- Provide wellness and prevention tips

GUIDELINES:
- Use simple, understandable language
- Be empathetic and supportive
- Always emphasize professional medical consultation
- Never diagnose or prescribe medications
- Provide emergency numbers when appropriate (108 for ambulance in India)
- Consider rural healthcare context and accessibility""",

    "general": """You are a helpful health and wellness assistant for the DIETEC app. You provide:

- General health tips and wellness advice
- Help navigating the app features
- Basic health information
- Lifestyle recommendations
- Mental wellness support

Always be supportive, helpful, and recommend professional help when needed."""
}


async def get_ai_response(message: str, chat_type: str = "general") -> str:
    """Get AI response using OpenAI."""
    if not openai_client:
        return get_fallback_response(message, chat_type)
    
    try:
        system_prompt = SYSTEM_PROMPTS.get(chat_type, SYSTEM_PROMPTS["general"])
        
        response = await openai_client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            max_tokens=800,
            temperature=0.7
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return get_fallback_response(message, chat_type)


def get_fallback_response(message: str, chat_type: str) -> str:
    """Provide fallback responses when AI is unavailable."""
    message_lower = message.lower()
    
    if chat_type == "nutrition":
        if any(word in message_lower for word in ["diabetes", "sugar", "diabetic"]):
            return """For diabetes management with local foods:

**Recommended Foods:**
• Whole millets (ragi, jowar, bajra) instead of white rice
• Green leafy vegetables (palak, methi, drumstick leaves)
• Bitter gourd (karela) - helps control blood sugar
• Fenugreek seeds (methi) - soak overnight, drink water

**Foods to Limit:**
• White rice, maida products
• Sugary drinks and sweets
• Potatoes, white bread

**Daily Tips:**
• Eat small, frequent meals
• Include protein with every meal
• Stay hydrated with water

⚠️ Please consult your doctor for personalized diabetes management."""

        if any(word in message_lower for word in ["child", "baby", "kid", "nutrition"]):
            return """For child nutrition:

**Essential Foods:**
• Milk and dairy (calcium for bones)
• Eggs (protein and vitamins)
• Seasonal fruits (vitamins)
• Green vegetables (iron, vitamins)
• Millets and whole grains (energy)

**Budget Tips (₹50-80/day):**
• Dal-rice with vegetables
• Roti with seasonal sabzi
• Banana/seasonal fruits
• Milk or buttermilk

**Growth Tips:**
• Regular meal times
• Avoid packaged snacks
• Encourage physical activity

⚠️ Consult a pediatrician for growth concerns."""

    elif chat_type == "medical":
        if any(word in message_lower for word in ["fever", "temperature"]):
            return """For fever management:

**Home Care:**
• Rest adequately
• Drink plenty of fluids (water, ORS, coconut water)
• Light, easily digestible food
• Lukewarm sponging if temperature is high

**When to See Doctor:**
• Fever above 103°F (39.4°C)
• Fever lasting more than 3 days
• Difficulty breathing
• Severe headache or neck stiffness
• In children under 3 months - any fever

**Emergency:** Call 108 if experiencing:
• Confusion or unconsciousness
• Severe breathing difficulty
• High fever with rash

⚠️ This is general information. Please consult a healthcare provider."""

    return """I'm here to help with health and nutrition questions!

You can ask me about:
• **Nutrition** - Diet plans, local recipes, diabetes-friendly foods
• **Medical Info** - General health questions, when to see a doctor
• **First Aid** - Basic emergency care information
• **Wellness** - Healthy lifestyle tips

How can I assist you today?

⚠️ Note: I provide general information only. Please consult healthcare professionals for medical advice."""


@router.post("/send", response_model=dict)
async def send_message(
    chat_message: ChatMessage,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Send a message and get AI response."""
    user_id = current_user.get("id")
    
    # Get AI response
    response = await get_ai_response(
        chat_message.message,
        chat_message.chat_type or "general"
    )
    
    # Save to history
    try:
        chat_entry = ChatHistory(
            user_id=UUID(user_id),
            message=chat_message.message,
            response=response,
            chat_type=chat_message.chat_type
        )
        db.add(chat_entry)
        await db.commit()
        await db.refresh(chat_entry)
        
        return {
            "id": str(chat_entry.id),
            "message": chat_message.message,
            "response": response,
            "chat_type": chat_message.chat_type,
            "created_at": str(chat_entry.created_at)
        }
    except Exception as e:
        # Return response even if saving fails
        return {
            "message": chat_message.message,
            "response": response,
            "chat_type": chat_message.chat_type
        }


@router.get("/history", response_model=List[dict])
async def get_chat_history(
    chat_type: Optional[str] = None,
    limit: int = 50,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get chat history."""
    user_id = current_user.get("id")
    
    query = select(ChatHistory).where(ChatHistory.user_id == UUID(user_id))
    
    if chat_type:
        query = query.where(ChatHistory.chat_type == chat_type)
    
    query = query.order_by(ChatHistory.created_at.desc()).limit(limit)
    
    result = await db.execute(query)
    history = result.scalars().all()
    
    return [
        {
            "id": str(h.id),
            "message": h.message,
            "response": h.response,
            "chat_type": h.chat_type,
            "created_at": str(h.created_at)
        }
        for h in reversed(history)  # Return in chronological order
    ]


@router.delete("/history")
async def clear_chat_history(
    chat_type: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Clear chat history."""
    user_id = current_user.get("id")
    
    from sqlalchemy import delete
    
    query = delete(ChatHistory).where(ChatHistory.user_id == UUID(user_id))
    
    if chat_type:
        query = query.where(ChatHistory.chat_type == chat_type)
    
    await db.execute(query)
    await db.commit()
    
    return {"message": "Chat history cleared"}
