/**
 * Service to fetch pet-related information in Tagalog
 * This service provides Tagalog translations of pet information
 */
class PetApiServiceTagalog {
  /**
   * Get random pet care tips based on pet type in Tagalog
   * @param {string} petType - Type of pet (dog, cat)
   * @returns {Promise<Object>} - Pet care tip in Tagalog
   */
  async getPetCareTips(petType = 'dog') {
    // Tagalog translations of pet care tips
    const dogTips = [
      {
        title: "Regular na Ehersisyo",
        content: "Ang mga aso ay nangangailangan ng regular na ehersisyo para manatiling malusog. Ang dami ay nag-iiba ayon sa lahi, edad, at kalagayan ng kalusugan."
      },
      {
        title: "Tamang Nutrisyon",
        content: "Pakainin ang iyong aso ng de-kalidad na pagkain na angkop sa kanilang edad, laki, at antas ng aktibidad."
      },
      {
        title: "Pangangalaga sa Ngipin",
        content: "Regular na sipilyuhin ang ngipin ng iyong aso para maiwasan ang sakit sa ngipin at mabahong hininga."
      },
      {
        title: "Grooming",
        content: "Ang regular na grooming ay tumutulong na mapanatiling malusog ang balahibo ng iyong aso at binabawasan ang paglagas."
      },
      {
        title: "Pakikisalamuha",
        content: "Ilantad ang iyong aso sa iba't ibang tao, alagang hayop, at kapaligiran para matulungan silang maging balanse."
      }
    ];

    const catTips = [
      {
        title: "Pangangalaga sa Litter Box",
        content: "Linisin ang litter box ng iyong pusa araw-araw at palitan ang buong litter isang beses sa isang linggo."
      },
      {
        title: "Scratching Posts",
        content: "Magbigay ng scratching posts para matulungan ang iyong pusa na mapanatili ang kanilang mga kuko at protektahan ang iyong mga kasangkapan."
      },
      {
        title: "Interactive na Paglalaro",
        content: "Ang regular na sesyon ng paglalaro ay tumutulong na panatilihing aktibo ang iyong pusa sa pisikal at mental na aspeto."
      },
      {
        title: "Grooming",
        content: "Kahit na ang mga pusa ay naglilinis ng kanilang sarili, ang regular na pagsisipilyo ay tumutulong na mabawasan ang hairballs at paglagas."
      },
      {
        title: "Hydration",
        content: "Tiyaking may access ang iyong pusa sa sariwang tubig sa lahat ng oras. Ang ilang mga pusa ay mas gusto ang umaagos na tubig mula sa fountain."
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
   * Get information about pet boarding in Tagalog
   * @returns {Object} - Boarding information in Tagalog
   */
  getBoardingInfo() {
    return {
      services: [
        {
          name: "Standard na Kwarto",
          description: "Pangunahing komportableng tirahan para sa iyong alaga",
          priceRange: "₱30-45 kada gabi depende sa laki ng alaga"
        },
        {
          name: "Deluxe na Kwarto",
          description: "Maluwang na tirahan na may karagdagang mga feature para sa kaginhawaan",
          priceRange: "₱45-60 kada gabi depende sa laki ng alaga"
        },
        {
          name: "Luxury Suite",
          description: "Premium na tirahan na may pinakamataas na antas ng kaginhawaan at amenities",
          priceRange: "₱60-80 kada gabi depende sa laki ng alaga"
        }
      ],
      policies: {
        checkInTime: "9:00 AM - 5:00 PM",
        checkOutTime: "Bago mag-12:00 PM",
        vaccinationRequirements: [
          "Mga Aso: Rabies, DHPP, Bordetella",
          "Mga Pusa: Rabies, FVRCP"
        ],
        cancellationPolicy: "48+ oras: Buong refund, 24-48 oras: 50% refund, <24 oras: Walang refund"
      }
    };
  }

  /**
   * Get information about pet grooming services in Tagalog
   * @returns {Object} - Grooming information in Tagalog
   */
  getGroomingInfo() {
    return {
      services: [
        {
          name: "Basic Grooming Package",
          description: "Paliligo, pagsisipilyo, paglilinis ng tainga, paggupit ng kuko",
          priceRange: "₱25-35 depende sa laki ng alaga at uri ng balahibo"
        },
        {
          name: "Full Grooming Package",
          description: "Basic package kasama ang paggupit/pag-style ng buhok, paglilinis ng ngipin, anal gland expression",
          priceRange: "₱45-65 depende sa laki ng alaga at uri ng balahibo"
        },
        {
          name: "Specialized na Treatments",
          description: "De-shedding, flea & tick treatment, medicated bath, paw pad treatment",
          priceRange: "Nag-iiba depende sa treatment"
        }
      ],
      recommendations: {
        frequency: {
          shortHaired: "Bawat 4-6 na linggo",
          longHaired: "Bawat 2-4 na linggo",
          doubleCoated: "Pana-panahon, lalo na sa panahon ng paglagas"
        }
      }
    };
  }
}

module.exports = new PetApiServiceTagalog();