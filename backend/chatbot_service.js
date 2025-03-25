const petApiService = require('./pet_api_service');
const geminiService = require('./gemini_service');

/**
 * Service to handle chatbot queries related to pet boarding and services
 */
class ChatbotService {
  /**
   * Process a user query and return a relevant response
   * @param {string} query - The user's question or message
   * @returns {Object} - Response with answer and optional sources
   */
  async processQuery(query) {
    // First try to use Gemini AI for more advanced responses
    try {
      console.log('Attempting to use Gemini AI for response...');
      const geminiResponse = await geminiService.generateContent(
        `You are a helpful assistant for a pet hotel that provides boarding and grooming services. 
        Answer the following query about pet boarding, pet care, or pet grooming: ${query}`
      );
      
      if (geminiResponse.status === 'success') {
        console.log('Successfully generated response with Gemini AI');
        return {
          answer: geminiResponse.text,
          sources: []
        };
      }
      
      // If Gemini fails, log the error and fall back to the rule-based chatbot
      console.log('Falling back to rule-based chatbot due to Gemini error:', geminiResponse.error);
    } catch (geminiError) {
      console.error('Error with Gemini service:', geminiError);
      // Continue to fallback
    }
    
    console.log('Using rule-based fallback for response...');
    
    // Convert query to lowercase for easier matching
    const queryLower = query.toLowerCase();
    
    // Analyze the query to determine the type of information needed
    const isPetBreedQuery = /breed|dog breed|cat breed|type of (dog|cat)/i.test(queryLower);
    const isPetCareQuery = /care|tip|advice|how to|maintain/i.test(queryLower);
    const isBoardingQuery = /board|stay|overnight|accommodation|room|suite|deluxe|price|cost|fee/i.test(queryLower);
    const isGroomingQuery = /groom|haircut|bath|nail|trim|brush/i.test(queryLower);
    const isGreeting = /hello|hi|hey|greetings|good (morning|afternoon|evening)/i.test(queryLower);
    
    // Prepare response
    let answer = '';
    let sources = [];
    
    // Handle greetings
    if (isGreeting) {
      return {
        answer: "Hello! How can I help you with your pet boarding questions today?",
        sources: []
      };
    }
    
    // Handle pet breed queries
    if (isPetBreedQuery) {
      const isDogQuery = /dog|puppy|canine/i.test(queryLower);
      const isCatQuery = /cat|kitten|feline/i.test(queryLower);
      
      if (isDogQuery) {
        const dogBreeds = await petApiService.getDogBreeds();
        const sampleBreeds = dogBreeds.slice(0, 5); // Limit to 5 breeds
        
        answer = "Here are some popular dog breeds that we accommodate:\n\n";
        sampleBreeds.forEach(breed => {
          answer += `- ${breed.name}: ${breed.temperament || 'No temperament info'}\n`;
        });
        answer += "\nWe welcome all dog breeds at our boarding facility. Let me know if you'd like information about a specific breed!";
      } else if (isCatQuery) {
        const catBreeds = await petApiService.getCatBreeds();
        const sampleBreeds = catBreeds.slice(0, 5); // Limit to 5 breeds
        
        answer = "Here are some popular cat breeds that we accommodate:\n\n";
        sampleBreeds.forEach(breed => {
          answer += `- ${breed.name}: ${breed.temperament || 'No temperament info'}\n`;
        });
        answer += "\nWe welcome all cat breeds at our boarding facility. Let me know if you'd like information about a specific breed!";
      } else {
        answer = "We accommodate all breeds of dogs and cats at our boarding facility. Would you like information about dog or cat breeds specifically?";
      }
    }
    
    // Handle pet care queries
    else if (isPetCareQuery) {
      const isDogQuery = /dog|puppy|canine/i.test(queryLower);
      const isCatQuery = /cat|kitten|feline/i.test(queryLower);
      
      let petType = 'dog'; // Default to dog
      if (isCatQuery) petType = 'cat';
      
      const careTip = await petApiService.getPetCareTips(petType);
      answer = `Here's a tip about ${petType} care: ${careTip.title}\n\n${careTip.content}\n\nWould you like another tip or have questions about our boarding services?`;
    }
    
    // Handle boarding queries
    else if (isBoardingQuery) {
      const boardingInfo = petApiService.getBoardingInfo();
      
      answer = "Here's information about our boarding services:\n\n";
      boardingInfo.services.forEach(service => {
        answer += `- ${service.name}: ${service.description}. Price: ${service.priceRange}\n`;
      });
      
      answer += "\nBoarding Policies:\n";
      answer += `- Check-in: ${boardingInfo.policies.checkInTime}\n`;
      answer += `- Check-out: ${boardingInfo.policies.checkOutTime}\n`;
      answer += `- Vaccination Requirements: ${boardingInfo.policies.vaccinationRequirements.join(', ')}\n`;
      answer += `- Cancellation Policy: ${boardingInfo.policies.cancellationPolicy}\n`;
    }
    
    // Handle grooming queries
    else if (isGroomingQuery) {
      const groomingInfo = petApiService.getGroomingInfo();
      
      answer = "Here's information about our grooming services:\n\n";
      groomingInfo.services.forEach(service => {
        answer += `- ${service.name}: ${service.description}. Price: ${service.priceRange}\n`;
      });
      
      answer += "\nGrooming Recommendations:\n";
      answer += `- Short-haired pets: ${groomingInfo.recommendations.frequency.shortHaired}\n`;
      answer += `- Long-haired pets: ${groomingInfo.recommendations.frequency.longHaired}\n`;
      answer += `- Double-coated pets: ${groomingInfo.recommendations.frequency.doubleCoated}\n`;
    }
    
    // Default response for unrecognized queries
    else {
      answer = "I'm here to help with questions about our pet boarding and grooming services. You can ask about our accommodations, prices, pet care tips, or specific breeds we accommodate. How can I assist you today?";
    }
    
    return {
      answer,
      sources
    };
  }
}

module.exports = new ChatbotService();