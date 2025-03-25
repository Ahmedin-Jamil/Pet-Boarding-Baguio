const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

/**
 * Service to interact with Google's Gemini API for AI-powered features
 * This service provides methods to generate content using the Gemini model
 */
class GeminiService {
  constructor() {
    // Initialize the Google Generative AI with the API key from environment variables
    this.apiKey = process.env.API_KEY;
    
    if (!this.apiKey) {
      console.error('WARNING: API_KEY for Gemini is not set in environment variables');
      this.model = null;
      return; // Exit constructor early if API key is missing
    }
    
    // Validate API key format (basic check)
    if (!this.apiKey.startsWith('AIza')) {
      console.error('WARNING: API_KEY for Gemini appears to be invalid (does not start with AIza)');
      this.model = null;
      return; // Exit constructor if API key format is invalid
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      
      // Configure for free version with safety limits
      const safetySettings = [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ];
      
      // Initialize with safety settings and temperature for free tier
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash", // Using standard Gemini 1.5 Flash model
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048, // Limit output tokens for free tier
        },
        safetySettings: safetySettings
      });
      
      // Add rate limiting for free tier
      this.requestCount = 0;
      this.requestLimit = 60; // Example: 60 requests per minute for free tier
      this.requestResetTime = Date.now() + 60000; // Reset after 1 minute
      
      console.log('Gemini AI service initialized successfully (Free Version)');
    } catch (error) {
      console.error('Failed to initialize Gemini AI service:', error);
      // Don't set this.model if initialization fails
      this.model = null;
    }
  }

  /**
   * Generate content using the Gemini model
   * @param {string} prompt - The prompt to send to the model
   * @returns {Promise<Object>} - The generated content
   */
  async generateContent(prompt) {
    try {
      // Check if the model was initialized properly
      if (!this.model) {
        throw new Error('Gemini AI model not initialized. Check your API key.');
      }
      
      // Check rate limits for free tier
      if (this.requestCount >= this.requestLimit) {
        // If current time is past reset time, reset the counter
        if (Date.now() > this.requestResetTime) {
          this.requestCount = 0;
          this.requestResetTime = Date.now() + 60000; // Reset after 1 minute
        } else {
          // Otherwise, we've hit the rate limit
          throw new Error('Rate limit exceeded for free tier. Please try again later.');
        }
      }
      
      // Increment request counter
      this.requestCount++;
      
      // Add safety measures for free API version
      // Limit prompt length to avoid exceeding free tier limits
      const maxPromptLength = 30000; // Characters limit for free tier
      const truncatedPrompt = prompt.length > maxPromptLength ? 
        prompt.substring(0, maxPromptLength) + '...' : prompt;
      
      // Generate content based on the prompt
      const result = await this.model.generateContent(truncatedPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Log success for debugging
      console.log('Successfully generated content with Gemini');
      
      return {
        text: text,
        status: 'success'
      };
    } catch (error) {
      console.error('Error generating content with Gemini:', error);
      
      // Provide more specific error messages based on error type
      let errorMessage = 'I\'m having trouble connecting to my knowledge base right now. Please try again later or contact our staff directly for assistance.';
      
      if (error.message.includes('API key')) {
        errorMessage = 'There was an issue with the AI service authentication. Please try again later or contact our staff directly for assistance.';
        console.error('API key validation error:', error.message);
      } else if (error.message.includes('network')) {
        errorMessage = 'There was a network issue connecting to the AI service. Please check your internet connection or contact our staff directly for assistance.';
        console.error('Network error connecting to Gemini API:', error.message);
      } else if (error.message.includes('timeout')) {
        errorMessage = 'The AI service took too long to respond. Please try again later or contact our staff directly for assistance.';
        console.error('Timeout error with Gemini API:', error.message);
      } else if (error.message.includes('not initialized') || error.message.includes('model not initialized')) {
        errorMessage = 'I\'m having trouble connecting to my knowledge base right now. Please try again later or contact our staff directly for assistance.';
        console.error('Gemini model initialization error:', error.message);
      } else if (error.message.includes('quota') || error.message.includes('rate limit') || error.message.includes('exceeded')) {
        errorMessage = 'You have reached the free tier usage limit for the AI service. Please try again later or consider upgrading to the paid version for higher limits.';
        console.error('Gemini API rate limit or quota exceeded:', error.message);
      }
      
      return {
        text: errorMessage,
        status: 'error',
        error: error.message
      };
    }
  }

  /**
   * Generate pet care advice using the Gemini model
   * @param {string} petType - The type of pet (dog, cat, etc.)
   * @param {string} topic - The topic to generate advice about
   * @returns {Promise<Object>} - The generated pet care advice
   */
  async generatePetCareAdvice(petType, topic) {
    const prompt = `Provide detailed care advice for ${petType}s regarding ${topic}. Include practical tips and best practices.`;
    return this.generateContent(prompt);
  }

  /**
   * Generate personalized boarding recommendations
   * @param {Object} petInfo - Information about the pet
   * @returns {Promise<Object>} - Personalized boarding recommendations
   */
  async generateBoardingRecommendations(petInfo) {
    const { type, breed, age, specialNeeds } = petInfo;
    const prompt = `Based on the following pet information, provide personalized boarding recommendations:
      - Pet Type: ${type}
      - Breed: ${breed}
      - Age: ${age}
      - Special Needs: ${specialNeeds || 'None'}
      
      Include room type recommendations, special accommodations, and care instructions.`;
    return this.generateContent(prompt);
  }
}

module.exports = new GeminiService();