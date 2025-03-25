const axios = require('axios');

/**
 * Service to fetch pet-related information from free public APIs
 * This service integrates with The Dog API and The Cat API to provide
 * information about different breeds, care tips, and images
 */
class PetApiService {
  constructor() {
    // Base URLs for the free APIs
    this.dogApiBaseUrl = 'https://api.thedogapi.com/v1';
    this.catApiBaseUrl = 'https://api.thecatapi.com/v1';
    
    // Initialize axios instances
    this.dogApiClient = axios.create({
      baseURL: this.dogApiBaseUrl,
      headers: {
        'x-api-key': process.env.DOG_API_KEY || '', // Optional API key
      },
    });
    
    this.catApiClient = axios.create({
      baseURL: this.catApiBaseUrl,
      headers: {
        'x-api-key': process.env.CAT_API_KEY || '', // Optional API key
      },
    });
  }

  /**
   * Get information about dog breeds
   * @param {string} query - Search query for breed name
   * @returns {Promise<Array>} - Array of breed information
   */
  async getDogBreeds(query = '') {
    try {
      const response = await this.dogApiClient.get('/breeds');
      let breeds = response.data;
      
      // Filter by query if provided
      if (query) {
        breeds = breeds.filter(breed => 
          breed.name.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      return breeds;
    } catch (error) {
      console.error('Error fetching dog breeds:', error);
      return [];
    }
  }

  /**
   * Get information about cat breeds
   * @param {string} query - Search query for breed name
   * @returns {Promise<Array>} - Array of breed information
   */
  async getCatBreeds(query = '') {
    try {
      const response = await this.catApiClient.get('/breeds');
      let breeds = response.data;
      
      // Filter by query if provided
      if (query) {
        breeds = breeds.filter(breed => 
          breed.name.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      return breeds;
    } catch (error) {
      console.error('Error fetching cat breeds:', error);
      return [];
    }
  }

  /**
   * Get random pet care tips based on pet type
   * @param {string} petType - Type of pet (dog, cat)
   * @returns {Promise<Object>} - Pet care tip
   */
  async getPetCareTips(petType = 'dog') {
    // These are hardcoded tips since there's no free API for pet care tips
    const dogTips = [
      {
        title: "Regular Exercise",
        content: "Dogs need regular exercise to stay healthy. The amount varies by breed, age, and health condition."
      },
      {
        title: "Proper Nutrition",
        content: "Feed your dog high-quality food appropriate for their age, size, and activity level."
      },
      {
        title: "Dental Care",
        content: "Brush your dog's teeth regularly to prevent dental disease and bad breath."
      },
      {
        title: "Grooming",
        content: "Regular grooming helps keep your dog's coat healthy and reduces shedding."
      },
      {
        title: "Socialization",
        content: "Expose your dog to different people, pets, and environments to help them become well-adjusted."
      }
    ];

    const catTips = [
      {
        title: "Litter Box Maintenance",
        content: "Clean your cat's litter box daily and change the litter completely once a week."
      },
      {
        title: "Scratching Posts",
        content: "Provide scratching posts to help your cat maintain their claws and protect your furniture."
      },
      {
        title: "Interactive Play",
        content: "Regular play sessions help keep your cat physically active and mentally stimulated."
      },
      {
        title: "Grooming",
        content: "Even though cats groom themselves, regular brushing helps reduce hairballs and shedding."
      },
      {
        title: "Hydration",
        content: "Ensure your cat has access to fresh water at all times. Some cats prefer running water from a fountain."
      }
    ];

    // Return a random tip based on pet type
    if (petType.toLowerCase() === 'cat') {
      return catTips[Math.floor(Math.random() * catTips.length)];
    } else {
      return dogTips[Math.floor(Math.random() * dogTips.length)];
    }
  }

  /**
   * Get information about pet boarding
   * @returns {Object} - Boarding information
   */
  getBoardingInfo() {
    return {
      services: [
        {
          name: "Standard Room",
          description: "Basic comfortable accommodation for your pet",
          priceRange: "$30-45 per night depending on pet size"
        },
        {
          name: "Deluxe Room",
          description: "Spacious accommodation with extra comfort features",
          priceRange: "$45-60 per night depending on pet size"
        },
        {
          name: "Luxury Suite",
          description: "Premium accommodation with the highest level of comfort and amenities",
          priceRange: "$60-80 per night depending on pet size"
        }
      ],
      policies: {
        checkInTime: "9:00 AM - 5:00 PM",
        checkOutTime: "Before 12:00 PM",
        vaccinationRequirements: [
          "Dogs: Rabies, DHPP, Bordetella",
          "Cats: Rabies, FVRCP"
        ],
        cancellationPolicy: "48+ hours: Full refund, 24-48 hours: 50% refund, <24 hours: No refund"
      }
    };
  }

  /**
   * Get information about pet grooming services
   * @returns {Object} - Grooming information
   */
  getGroomingInfo() {
    return {
      services: [
        {
          name: "Basic Grooming Package",
          description: "Bath, brush, ear cleaning, nail trimming",
          priceRange: "$25-35 depending on pet size and coat type"
        },
        {
          name: "Full Grooming Package",
          description: "Basic package plus haircut/styling, teeth brushing, anal gland expression",
          priceRange: "$45-65 depending on pet size and coat type"
        },
        {
          name: "Specialized Treatments",
          description: "De-shedding, flea & tick treatment, medicated bath, paw pad treatment",
          priceRange: "Varies based on treatment"
        }
      ],
      recommendations: {
        frequency: {
          shortHaired: "Every 4-6 weeks",
          longHaired: "Every 2-4 weeks",
          doubleCoated: "Seasonal, especially during shedding periods"
        }
      }
    };
  }
}

module.exports = new PetApiService();