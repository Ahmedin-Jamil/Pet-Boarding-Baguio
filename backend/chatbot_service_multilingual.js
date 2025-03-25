const petApiService = require('./pet_api_service');
const petApiServiceTagalog = require('./pet_api_service_tl');
const geminiService = require('./gemini_service');

/**
 * Service to handle chatbot queries related to pet boarding and services in multiple languages
 */
class ChatbotServiceMultilingual {
  /**
   * Process a user query and return a relevant response in the specified language
   * @param {string} query - The user's question or message
   * @param {string} language - The language code (en, tl)
   * @returns {Object} - Response with answer and optional sources
   */
  async processQuery(query, language = 'en') {
    // Select the appropriate API service based on language
    let apiService;
    let geminiPrompt;
    
    switch (language) {
      case 'tl':
        apiService = petApiServiceTagalog;
        geminiPrompt = `Ikaw ay isang kapaki-pakinabang na assistant para sa isang pet hotel na nagbibigay ng boarding at grooming services. Sagutin ang sumusunod na katanungan tungkol sa pet boarding, pet care, o pet grooming: ${query}`;
        break;
      default: // 'en'
        apiService = petApiService;
        geminiPrompt = `You are a helpful assistant for a pet hotel that provides boarding and grooming services. Answer the following query about pet boarding, pet care, or pet grooming: ${query}`;
        break;
    }
    
    // First try to use Gemini AI for more advanced responses
    try {
      console.log(`Attempting to use Gemini AI for response in ${language}...`);
      const geminiResponse = await geminiService.generateContent(geminiPrompt);
      
      if (geminiResponse.status === 'success') {
        console.log(`Successfully generated response with Gemini AI in ${language}`);
        return {
          answer: geminiResponse.text,
          sources: []
        };
      }
      
      // If Gemini fails, log the error and fall back to the rule-based chatbot
      console.log(`Falling back to rule-based chatbot due to Gemini error in ${language}:`, geminiResponse.error);
    } catch (geminiError) {
      console.error(`Error with Gemini service in ${language}:`, geminiError);
      // Continue to fallback
    }
    
    console.log(`Using rule-based fallback for response in ${language}...`);
    
    // Convert query to lowercase for easier matching
    const queryLower = query.toLowerCase();
    
    // Define regex patterns for different languages
    let patterns;
    
    switch (language) {
      case 'tl':
        patterns = {
          breed: /lahi|uri|klase|lahi ng aso|lahi ng pusa|uri ng (aso|pusa)/i,
          care: /pag-aalaga|payo|gabay|paano|panatilihin/i,
          boarding: /boarding|tirahan|matutuluyan|kwarto|suite|deluxe|presyo|halaga|bayad/i,
          grooming: /grooming|gupit|paliligo|kuko|trim|brush/i,
          greeting: /hello|hi|hey|kamusta|magandang (umaga|hapon|gabi)/i,
          dog: /aso|tuta|aso/i,
          cat: /pusa|kuting|pusa/i
        };
        break;
      default: // 'en'
        patterns = {
          breed: /breed|dog breed|cat breed|type of (dog|cat)/i,
          care: /care|tip|advice|how to|maintain/i,
          boarding: /board|stay|overnight|accommodation|room|suite|deluxe|price|cost|fee/i,
          grooming: /groom|haircut|bath|nail|trim|brush/i,
          greeting: /hello|hi|hey|greetings|good (morning|afternoon|evening)/i,
          dog: /dog|puppy|canine/i,
          cat: /cat|kitten|feline/i
        };
        break;
    }
    
    // Analyze the query to determine the type of information needed
    const isPetBreedQuery = patterns.breed.test(queryLower);
    const isPetCareQuery = patterns.care.test(queryLower);
    const isBoardingQuery = patterns.boarding.test(queryLower);
    const isGroomingQuery = patterns.grooming.test(queryLower);
    const isGreeting = patterns.greeting.test(queryLower);
    
    // Prepare response
    let answer = '';
    let sources = [];
    
    // Handle greetings in different languages
    if (isGreeting) {
      switch (language) {
        case 'tl':
          return {
            answer: "Kumusta! Paano kita matutulungan sa iyong mga katanungan tungkol sa pet boarding ngayong araw?",
            sources: []
          };
        default: // 'en'
          return {
            answer: "Hello! How can I help you with your pet boarding questions today?",
            sources: []
          };
      }
    }
    
    // Handle pet breed queries
    if (isPetBreedQuery) {
      const isDogQuery = patterns.dog.test(queryLower);
      const isCatQuery = patterns.cat.test(queryLower);
      
      if (isDogQuery) {
        const dogBreeds = await apiService.getDogBreeds();
        const sampleBreeds = dogBreeds.slice(0, 5); // Limit to 5 breeds
        
        switch (language) {
          case 'tl':
            answer = "Narito ang ilang sikat na lahi ng aso na aming tinatanggap:\n\n";
            sampleBreeds.forEach(breed => {
              answer += `- ${breed.name}: ${breed.temperament || 'Walang impormasyon sa temperament'}\n`;
            });
            answer += "\nTinatanggap namin ang lahat ng lahi ng aso sa aming boarding facility. Ipaalam sa akin kung gusto mo ng impormasyon tungkol sa isang partikular na lahi!";
            break;
        }
      } else if (isCatQuery) {
        const catBreeds = await apiService.getCatBreeds();
        const sampleBreeds = catBreeds.slice(0, 5); // Limit to 5 breeds
        
        switch (language) {
          case 'tl':
            answer = "Narito ang ilang sikat na lahi ng pusa na aming tinatanggap:\n\n";
            sampleBreeds.forEach(breed => {
              answer += `- ${breed.name}: ${breed.temperament || 'Walang impormasyon sa temperament'}\n`;
            });
            answer += "\nTinatanggap namin ang lahat ng lahi ng pusa sa aming boarding facility. Ipaalam sa akin kung gusto mo ng impormasyon tungkol sa isang partikular na lahi!";
            break;
          default: // 'en'
            answer = "Here are some popular cat breeds that we accommodate:\n\n";
            sampleBreeds.forEach(breed => {
              answer += `- ${breed.name}: ${breed.temperament || 'No temperament info'}\n`;
            });
            answer += "\nWe welcome all cat breeds at our boarding facility. Let me know if you'd like information about a specific breed!";
            break;
        }
      } else {
        switch (language) {
          case 'tl':
            answer = "Tinatanggap namin ang lahat ng lahi ng aso at pusa sa aming boarding facility. Gusto mo ba ng impormasyon tungkol sa lahi ng aso o pusa partikular?";
            break;
          default: // 'en'
            answer = "We accommodate all breeds of dogs and cats at our boarding facility. Would you like information about dog or cat breeds specifically?";
            break;
        }
      }
    }
    
    // Handle pet care queries
    else if (isPetCareQuery) {
      const isDogQuery = patterns.dog.test(queryLower);
      const isCatQuery = patterns.cat.test(queryLower);
      
      let petType = 'dog'; // Default to dog
      if (isCatQuery) petType = 'cat';
      
      const careTip = await apiService.getPetCareTips(petType);
      
      switch (language) {
        case 'tl':
          answer = `Narito ang isang tip tungkol sa pag-aalaga ng ${petType === 'cat' ? 'pusa' : 'aso'}: ${careTip.title}\n\n${careTip.content}\n\nGusto mo ba ng isa pang tip o may mga katanungan ka ba tungkol sa aming mga serbisyo sa boarding?`;
          break;
        default: // 'en'
          answer = `Here's a tip about ${petType} care: ${careTip.title}\n\n${careTip.content}\n\nWould you like another tip or have questions about our boarding services?`;
          break;
      }
    }
    
    // Handle boarding queries
    else if (isBoardingQuery) {
      const boardingInfo = apiService.getBoardingInfo();
      
      switch (language) {
        case 'tl':
          answer = "Narito ang impormasyon tungkol sa aming mga serbisyo sa boarding:\n\n";
          boardingInfo.services.forEach(service => {
            answer += `- ${service.name}: ${service.description}. Presyo: ${service.priceRange}\n`;
          });
          
          answer += "\nMga Patakaran sa Boarding:\n";
          answer += `- Oras ng Check-in: ${boardingInfo.policies.checkInTime}\n`;
          answer += `- Oras ng Check-out: ${boardingInfo.policies.checkOutTime}\n`;
          answer += `- Mga Kinakailangang Bakuna: ${boardingInfo.policies.vaccinationRequirements.join(', ')}\n`;
          answer += `- Patakaran sa Pagkansela: ${boardingInfo.policies.cancellationPolicy}\n`;
          break;
        default: // 'en'
          answer = "Here's information about our boarding services:\n\n";
          boardingInfo.services.forEach(service => {
            answer += `- ${service.name}: ${service.description}. Price: ${service.priceRange}\n`;
          });
          
          answer += "\nBoarding Policies:\n";
          answer += `- Check-in: ${boardingInfo.policies.checkInTime}\n`;
          answer += `- Check-out: ${boardingInfo.policies.checkOutTime}\n`;
          answer += `- Vaccination Requirements: ${boardingInfo.policies.vaccinationRequirements.join(', ')}\n`;
          answer += `- Cancellation Policy: ${boardingInfo.policies.cancellationPolicy}\n`;
          break;
      }
    }
    
    // Handle grooming queries
    else if (isGroomingQuery) {
      const groomingInfo = apiService.getGroomingInfo();
      
      switch (language) {
        case 'tl':
          answer = "Narito ang impormasyon tungkol sa aming mga serbisyo sa grooming:\n\n";
          groomingInfo.services.forEach(service => {
            answer += `- ${service.name}: ${service.description}. Presyo: ${service.priceRange}\n`;
          });
          
          answer += "\nMga Rekomendasyon sa Grooming:\n";
          answer += `- Mga alagang may maikling buhok: ${groomingInfo.recommendations.frequency.shortHaired}\n`;
          answer += `- Mga alagang may mahabang buhok: ${groomingInfo.recommendations.frequency.longHaired}\n`;
          answer += `- Mga alagang may double coat: ${groomingInfo.recommendations.frequency.doubleCoated}\n`;
          break;
        default: // 'en'
          answer = "Here's information about our grooming services:\n\n";
          groomingInfo.services.forEach(service => {
            answer += `- ${service.name}: ${service.description}. Price: ${service.priceRange}\n`;
          });
          
          answer += "\nGrooming Recommendations:\n";
          answer += `- Short-haired pets: ${groomingInfo.recommendations.frequency.shortHaired}\n`;
          answer += `- Long-haired pets: ${groomingInfo.recommendations.frequency.longHaired}\n`;
          answer += `- Double-coated pets: ${groomingInfo.recommendations.frequency.doubleCoated}\n`;
          break;
      }
    }
    
    // Default response for unrecognized queries
    else {
      switch (language) {
        case 'tl':
          answer = "Narito ako para tumulong sa mga katanungan tungkol sa aming mga serbisyo sa pet boarding at grooming. Maaari kang magtanong tungkol sa aming mga tirahan, presyo, mga tip sa pag-aalaga ng alagang hayop, o mga partikular na lahi na aming tinatanggap. Paano kita matutulungan ngayon?";
          break;
        default: // 'en'
          answer = "I'm here to help with questions about our pet boarding and grooming services. You can ask about our accommodations, prices, pet care tips, or specific breeds we accommodate. How can I assist you today?";
          break;
      }
    }
    
    return {
      answer,
      sources
    };
  }
}

module.exports = new ChatbotServiceMultilingual();