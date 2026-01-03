/**
 * ChatGPT Service for DIETEC Nutrition Assistant
 * 
 * This service provides integration with ChatGPT API for advanced nutrition advice.
 * Uses OpenAI's GPT models for context-aware, culturally-appropriate nutrition guidance.
 */

interface ChatGPTConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface ChatGPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class ChatGPTService {
  private config: ChatGPTConfig;
  private conversationHistory: ChatGPTMessage[] = [];
  private apiKey: string | null = null;

  constructor(config: ChatGPTConfig = {}) {
    // Try to get API key from environment variable first
    this.apiKey = typeof process !== 'undefined' && process.env?.OPENAI_API_KEY 
      ? process.env.OPENAI_API_KEY 
      : config.apiKey || null;

    this.config = {
      model: config.model || 'gpt-3.5-turbo',
      maxTokens: config.maxTokens || 800,
      temperature: config.temperature || 0.7,
      ...config
    };

    // Initialize with system prompt for nutrition context
    this.conversationHistory = [{
      role: 'system',
      content: `You are a specialized nutrition assistant for rural communities in India. Your expertise includes:

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

Always prioritize safety and recommend consulting healthcare providers for serious medical conditions.`
    }];
  }

  /**
   * Get nutrition advice from ChatGPT
   */
  async getNutritionAdvice(userQuestion: string): Promise<string> {
    try {
      // Add user message to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: userQuestion
      });

      let response: string;

      // Check if we have a valid API key
      if (this.apiKey && this.apiKey !== 'YOUR_OPENAI_API_KEY_HERE') {
        // Use real OpenAI API
        response = await this.callOpenAI();
      } else {
        // Fallback to mock implementation if no API key
        console.warn('No OpenAI API key configured. Using mock responses.');
        response = await this.mockChatGPTAPI(userQuestion);
      }
      
      // Add assistant response to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        content: response
      });

      return response;

    } catch (error) {
      console.error('ChatGPT Service Error:', error);
      
      // If API call fails, try fallback
      const fallbackResponse = await this.mockChatGPTAPI(userQuestion);
      this.conversationHistory.push({
        role: 'assistant',
        content: fallbackResponse
      });
      
      return fallbackResponse;
    }
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: this.conversationHistory,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Set API key dynamically
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * MOCK IMPLEMENTATION - Fallback when API key is not available
   * Provides high-quality nutrition responses tailored for rural India
   */
  private async mockChatGPTAPI(userInput: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

    const input = userInput.toLowerCase();
    
    // Handle greetings
    if (input.match(/^(hi|hello|hey|namaste|namaskar|hola|good morning|good afternoon|good evening)$/i) || 
        input.match(/^(hi|hello|hey|namaste|namaskar)\s*[!.?]*$/i)) {
      return `Hello! 👋 I'm your AI nutrition assistant for rural health.\n\nI can help you with:\n• Affordable meal planning (₹150-300/day)\n• Pregnancy and child nutrition\n• Diabetes and health management\n• Kitchen garden tips\n• Traditional remedies\n• Budget-friendly recipes\n\nWhat would you like to know about healthy eating today?`;
    }

    // Handle "how are you" type questions
    if (input.includes('how are you') || input.includes('how r u') || input.includes('kaise ho')) {
      return `I'm doing great, thank you for asking! 😊\n\nI'm here and ready to help you with nutrition advice. Whether you need meal plans, health tips, or advice on local ingredients, I'm here to assist.\n\nWhat nutrition question can I help you with today?`;
    }

    // Handle thank you
    if (input.match(/^(thank|thanks|thank you|thanku|धन्यवाद|shukriya)$/i) || 
        input.includes('thank you') || input.includes('thanks')) {
      return `You're very welcome! 😊\n\nI'm always here to help with your nutrition questions. Feel free to ask me anything about:\n• Healthy meals\n• Child nutrition\n• Pregnancy diet\n• Managing health conditions\n• Kitchen gardening\n\nTake care and eat healthy! 🌱`;
    }

    // Handle goodbye
    if (input.match(/^(bye|goodbye|see you|alvida|take care)$/i) || 
        input.includes('good bye') || input.includes('see you')) {
      return `Goodbye! Take care and stay healthy! 👋\n\nRemember to:\n✓ Eat balanced meals\n✓ Include local vegetables\n✓ Stay hydrated\n✓ Consult doctors for serious health issues\n\nCome back anytime you need nutrition advice!`;
    }

    // Handle general help requests
    if (input.includes('help') || input.includes('what can you do') || input.includes('capabilities')) {
      return `I'm your specialized nutrition assistant for rural India! 🌾\n\nI can help you with:\n\n**📋 Meal Planning**\n• Weekly budget menus (₹150-300/family)\n• Quick 15-minute recipes\n• Seasonal cooking tips\n\n**👶 Family Nutrition**\n• Pregnancy diet plans\n• Baby food (6+ months)\n• Child growth nutrition\n\n**🏥 Health Management**\n• Diabetes-friendly meals\n• Weight management\n• Anemia prevention\n\n**🌱 Sustainable Living**\n• Kitchen garden planning\n• Traditional remedies\n• Food preservation\n\nJust ask me a specific question and I'll provide detailed, practical advice!`;
    }
    
    // Enhanced responses with ChatGPT-like quality and detail
    if (input.includes('meal plan') || input.includes('weekly') || input.includes('daily menu')) {
      return `📅 **7-Day Nutrition Plan for Rural Families** (Budget: ₹150-200/day for 4 people)

**MONDAY - Millet Monday**
🌅 Breakfast: Ragi porridge with jaggery (₹15)
🌞 Lunch: Bajra roti + moong dal + seasonal vegetable (₹45)
🌙 Dinner: Brown rice + masoor dal + yogurt (₹40)

**TUESDAY - Protein Power**
🌅 Breakfast: Sprouted moong chaat + tea (₹20)
🌞 Lunch: Chickpea curry + wheat roti + onion salad (₹50)
🌙 Dinner: Khichdi with vegetables + buttermilk (₹35)

**WEDNESDAY - Green Day**
🌅 Breakfast: Vegetable upma + coconut chutney (₹25)
🌞 Lunch: Spinach dal + jowar roti + pickle (₹40)
🌙 Dinner: Mixed vegetable curry + rice + curd (₹45)

**Continue this pattern with:**
- **Thursday**: Focus on iron-rich foods (amaranth, sesame)
- **Friday**: Include seasonal fruits and nuts
- **Weekend**: Special meals with eggs/chicken if available

**Shopping List**: ₹800-1000 per week for family of 4
**Preparation Tips**: Soak grains overnight, pressure cook in batches
**Health Benefits**: Balanced protein, fiber, vitamins, minerals`;
    }

    if (input.includes('pregnancy') || input.includes('pregnant') || input.includes('maternal')) {
      return `🤱 **Complete Pregnancy Nutrition Guide for Rural Areas**

**ESSENTIAL NUTRIENTS (Daily Requirements):**
• **Folic Acid**: Dark leafy vegetables, masoor dal, amaranth
• **Iron**: Sesame seeds, jaggery, drumstick leaves (20-30mg/day)
• **Calcium**: Ragi, sesame seeds, dairy products (1200mg/day)
• **Protein**: Mixed dal, eggs, milk (70-80g/day)

**TRIMESTER-WISE NUTRITION:**

**First Trimester (0-3 months):**
- Focus: Folate-rich foods to prevent birth defects
- Foods: Green leafy vegetables, citrus fruits, fortified cereals
- Manage nausea: Ginger tea, small frequent meals

**Second Trimester (4-6 months):**
- Focus: Iron and calcium for baby's development
- Foods: Ragi laddu, til (sesame) preparations, dairy
- Increase calories by 300-350/day

**Third Trimester (7-9 months):**
- Focus: Protein for rapid growth, prepare for breastfeeding
- Foods: Dal varieties, nuts, eggs (if consuming)
- Healthy weight gain: 1-2 kg per month

**RURAL-SPECIFIC TIPS:**
• **Garden herbs**: Grow mint, coriander, curry leaves for vitamins
• **Traditional foods**: Ragi malt, til laddu, dry fruits
• **Safe practices**: Avoid raw vegetables, ensure clean water
• **Regular monitoring**: Monthly check-ups at nearest PHC

**Budget meal**: ₹80-100/day additional for pregnancy nutrition needs`;
    }

    if (input.includes('child') || input.includes('baby') || input.includes('infant')) {
      return `👶 **Complete Child Nutrition Guide by Age Groups**

**INFANTS (0-6 months):**
- **Exclusive breastfeeding** - no water, food, or other liquids needed
- **Mother's nutrition**: Affects milk quality - eat protein-rich foods
- **Warning signs**: Weak sucking, no weight gain, excessive crying

**6-12 MONTHS (Starting Solids):**
**Month 6**: Start with single foods
- Mashed rice with ghee
- Mashed banana
- Thin dal water

**Month 7-8**: Combinations
- Rice + dal khichdi (well-cooked)
- Mashed sweet potato
- Ragi porridge with breast milk

**Month 9-12**: Family foods
- Soft chapati pieces
- Mashed vegetables
- Egg yolk (if family consumes eggs)

**1-3 YEARS (Toddler Power Foods):**
• **Protein**: 2-3 servings of dal, eggs, or dairy daily
• **Iron**: Dark green vegetables, ragi, jaggery
• **Brain foods**: Nuts (powdered), ghee, fish (if available)

**Sample Daily Menu (Age 2):**
- Breakfast: Ragi porridge + banana (₹15)
- Lunch: Rice + dal + vegetables + ghee (₹25)
- Snack: Roasted peanuts or seasonal fruit (₹10)
- Dinner: Khichdi with vegetables + curd (₹20)

**Growth Monitoring**: Visit Anganwadi monthly for height/weight tracking
**Red Flags**: No appetite, frequent illness, delayed milestones`;
    }

    if (input.includes('kitchen garden') || input.includes('grow') || input.includes('farming')) {
      return `🌱 **Kitchen Garden for Nutrition Security**

**EASY-TO-GROW NUTRITION POWERHOUSES:**

**Leafy Vegetables (15-30 days):**
• **Spinach**: Rich in iron, grows in small spaces
• **Methi (Fenugreek)**: Leaves for food, seeds for medicine
• **Amaranth**: Protein-rich leaves and seeds
• **Coriander/Mint**: Fresh herbs for vitamins

**Quick Vegetables (30-60 days):**
• **Radish**: Leaves and roots both edible
• **Bottle gourd**: Vines provide continuous harvest
• **Okra**: High fiber, multiple harvests
• **Tomatoes**: Vitamin C, year-round growth

**SEASONAL PLANNING:**
**Summer**: Bottle gourd, okra, amaranth, mint
**Monsoon**: Spinach, methi, coriander, chilies
**Winter**: Radish, turnip, peas, mustard greens

**SPACE-EFFICIENT METHODS:**
• **Vertical growing**: Bottle gourds on rooftops
• **Container gardening**: Old pots, buckets for herbs
• **Succession planting**: Sow spinach every 2 weeks
• **Companion planting**: Radish with spinach

**COST-BENEFIT:**
- **Investment**: ₹500-1000 for seeds, basic tools
- **Returns**: ₹200-300 worth vegetables monthly
- **Health benefits**: Fresh, pesticide-free nutrition

**Water-saving tips**: Mulching, drip irrigation with bottles
**Organic fertilizer**: Compost from kitchen waste
**Pest control**: Neem spray, companion herbs`;
    }

    if (input.includes('traditional') || input.includes('remedy') || input.includes('ayurveda')) {
      return `🌿 **Traditional Remedies with Modern Nutrition Science**

**DIGESTIVE HEALTH:**
• **Ajwain (Carom seeds)**: After meals for gas, bloating
  - Science: Contains thymol, improves enzyme production
  - Usage: 1 tsp with warm water after heavy meals

• **Jeera water**: Morning drink for metabolism
  - Science: Improves insulin sensitivity, aids fat metabolism  
  - Recipe: Boil 1 tsp cumin in water, drink warm

**IMMUNITY BOOSTERS:**
• **Turmeric milk**: Anti-inflammatory, immune support
  - Science: Curcumin reduces inflammation markers
  - Recipe: 1 tsp turmeric + pinch black pepper in warm milk

• **Tulsi-Ginger tea**: Respiratory health, stress relief
  - Science: Adaptogenic herbs reduce cortisol levels
  - Daily: 5-6 fresh tulsi leaves + 1" ginger piece

**DIABETES MANAGEMENT:**
• **Bitter gourd juice**: Blood sugar control
  - Science: Contains charantin, mimics insulin action
  - Usage: 30ml fresh juice before breakfast (bitter!)

• **Fenugreek seeds**: Soaked overnight, eat in morning
  - Science: Soluble fiber slows glucose absorption
  - Dosage: 1 tsp soaked seeds daily

**ANEMIA FIGHTERS:**
• **Sesame-jaggery balls**: Iron absorption booster
  - Science: Vitamin C in jaggery enhances iron uptake
  - Recipe: Mix equal parts, make small balls

• **Nettle tea**: If available locally, highest plant iron source
  - Science: Bioavailable iron, vitamin C included
  - Caution: Proper identification essential

**SAFETY GUIDELINES:**
- Start with small doses
- Monitor blood sugar if diabetic
- Consult doctor for serious conditions
- Avoid during pregnancy without medical advice`;
    }

    // Default comprehensive response
    return `🤖 **ChatGPT Nutrition Assistant - Comprehensive Help Available**

I'm here to provide detailed, evidence-based nutrition advice specifically tailored for rural Indian communities. I can help you with:

**🥗 MEAL PLANNING & RECIPES:**
- 7-day budget meal plans (₹150-300/family/day)
- Regional recipes using local ingredients
- Seasonal cooking and food preservation
- Quick 15-30 minute meal solutions

**👥 LIFE-STAGE NUTRITION:**
- Pregnancy and maternal health nutrition
- Infant feeding and child development foods
- Elderly nutrition and digestive health
- Teen nutrition during growth spurts

**🏥 HEALTH CONDITION MANAGEMENT:**
- Diabetes control with Indian foods
- Weight management for rural lifestyles  
- Anemia prevention and treatment
- Digestive issues and gut health

**🌱 SUSTAINABLE NUTRITION:**
- Kitchen garden planning and tips
- Water-efficient food production
- Traditional remedies backed by science
- Food safety and storage without refrigeration

**💡 SMART RURAL SOLUTIONS:**
- Cooking methods that save fuel and time
- Nutrient-dense foods on tight budgets
- Making the most of seasonal abundance
- Community nutrition and sharing resources

**Ask me specific questions like:**
- "Plan a weekly menu for ₹200 for family of 4"
- "How to manage diabetes with local vegetables"
- "What foods help my 2-year-old gain weight"
- "Kitchen garden plan for small space"

What specific nutrition challenge can I help you solve today?`;
  }

  /**
   * Clear conversation history (for new conversation)
   */
  clearHistory(): void {
    this.conversationHistory = this.conversationHistory.slice(0, 1); // Keep only system message
  }

  /**
   * Get conversation history
   */
  getHistory(): ChatGPTMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Check if service is properly configured
   */
  isConfigured(): boolean {
    return this.apiKey !== 'YOUR_OPENAI_API_KEY_HERE' && !!this.apiKey;
  }
}

// Export a singleton instance
export const chatGPTService = new ChatGPTService();

// Export types for external use
export type { ChatGPTConfig, ChatGPTMessage };