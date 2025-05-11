const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pet_hotel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log('Attempting to connect to database with following configuration:');
console.log('- Host:', dbConfig.host);
console.log('- User:', dbConfig.user);
console.log('- Database:', dbConfig.database);

// Import services
// Temporarily commenting out RAG service due to compatibility issues
// const ragService = require('./rag_service');
const petApiService = require('./pet_api_service');
const geminiService = require('./gemini_service');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Temporarily disable RAG service routes
// app.use('/api/chatbot', ragService);

// Import chatbot services
const chatbotService = require('./chatbot_service');
const chatbotServiceMultilingual = require('./chatbot_service_multilingual');

// Add endpoint for chatbot
app.post('/api/chatbot/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // First try to use Gemini AI for more advanced responses
    try {
      const geminiResponse = await geminiService.generateContent(
        `You are a helpful assistant for a pet hotel that provides boarding and grooming services. 
        Answer the following query about pet boarding, pet care, or pet grooming: ${query}`
      );
      
      if (geminiResponse.status === 'success') {
        return res.json({
          answer: geminiResponse.text,
          sources: []
        });
      }
      // If Gemini fails, log the error and fall back to the rule-based chatbot
      console.log('Falling back to rule-based chatbot due to Gemini error:', geminiResponse.error);
      
      // If Gemini returned a specific error message, use it instead of the generic fallback
      if (geminiResponse.text && geminiResponse.text !== '') {
        return res.json({
          answer: geminiResponse.text,
          sources: []
        });
      }
    } catch (geminiError) {
      console.error('Error with Gemini service:', geminiError);
      // Continue to fallback
    }
    
    // Fallback to rule-based chatbot
    const response = await chatbotService.processQuery(query);
    res.json(response);
  } catch (error) {
    console.error('Error processing chatbot query:', error);
    res.status(500).json({
      answer: "I'm having trouble connecting to my knowledge base right now. Please try again later or contact our staff directly for assistance.",
      sources: []
    });
  }
});

// Add endpoint for multilingual chatbot
app.post('/api/chatbot/query/multilingual', async (req, res) => {
  try {
    const { query, language } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    console.log(`Processing multilingual query in ${language || 'en'} language:`, query);
    
    // First try to use Gemini AI for more advanced responses
    try {
      let geminiPrompt;
      
      switch (language) {
        case 'tl':
          geminiPrompt = `Ikaw ay isang kapaki-pakinabang na assistant para sa isang pet hotel na nagbibigay ng boarding at grooming services. Sagutin ang sumusunod na katanungan tungkol sa pet boarding, pet care, o pet grooming: ${query}`;
          break;
        default: // 'en'
          geminiPrompt = `You are a helpful assistant for a pet hotel that provides boarding and grooming services. Answer the following query about pet boarding, pet care, or pet grooming: ${query}`;
          break;
      }
      
      const geminiResponse = await geminiService.generateContent(geminiPrompt);
      
      if (geminiResponse.status === 'success') {
        console.log(`Successfully generated response with Gemini AI in ${language || 'en'}`);
        return res.json({
          answer: geminiResponse.text,
          sources: []
        });
      }
      
      // If Gemini returned a specific error message, use it instead of falling back
      if (geminiResponse.text && geminiResponse.text !== '') {
        console.log(`Using Gemini error message as response for ${language || 'en'} query`);
        return res.json({
          answer: geminiResponse.text,
          sources: []
        });
      }
      
      // If Gemini fails, log the error and fall back to the rule-based chatbot
      console.log(`Falling back to rule-based chatbot due to Gemini error in ${language || 'en'}:`, geminiResponse.error);
    } catch (geminiError) {
      console.error(`Error with Gemini service for ${language || 'en'} query:`, geminiError);
      // Continue to fallback
    }
    
    // Process the query using the multilingual service as fallback
    const response = await chatbotServiceMultilingual.processQuery(query, language);
    res.json(response);
  } catch (error) {
    console.error('Error processing multilingual chatbot query:', error);
    
    // Provide language-specific error messages
    let errorMessage;
    switch (req.body.language) {
      case 'tl':
        errorMessage = "Nagkakaproblema ako sa pagkonekta sa aking knowledge base ngayon. Pakisubukang muli mamaya o direktang makipag-ugnayan sa aming staff para sa tulong.";
        break;
      default: // 'en'
        errorMessage = "I'm having trouble connecting to my knowledge base right now. Please try again later or contact our staff directly for assistance.";
        break;
    }
    
    res.status(500).json({
      answer: errorMessage,
      sources: []
    });
  }
});

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'pet_hotel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    console.log('Connected to database:', process.env.DB_HOST);
    connection.release();
    return true;
  } catch (error) {
    console.error('Error connecting to database:', error);
    console.log('Database connection details (without password):');
    console.log('- Host:', process.env.DB_HOST || 'not set');
    console.log('- User:', process.env.DB_USER || 'not set');
    console.log('- Database:', process.env.DB_NAME || 'not set');
    console.log('- Port:', process.env.DB_PORT || '3306 (default)');
    console.log('Continuing without database connection...');
    return false;
  }
}

// Try to connect but continue even if it fails
testConnection();

// Start server with available port
let currentPort = parseInt(PORT, 10);
const startServer = () => {
  app.listen(currentPort, () => {
    console.log(`Server is running on port ${currentPort}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${currentPort} is busy, trying port ${currentPort + 1}`);
      currentPort += 1;
      startServer();
    } else {
      console.error('Server error:', err);
    }
  });
};

// Only call startServer once
startServer();

// Routes
app.get('/', (req, res) => {
  res.send('Pet Hotel API is running');
});

// Pet API Routes
// Get dog breeds
app.get('/api/pets/dogs', async (req, res) => {
  try {
    const dogBreeds = await petApiService.getDogBreeds();
    res.json(dogBreeds);
  } catch (error) {
    console.error('Error fetching dog breeds:', error);
    res.status(500).json({ error: 'Failed to fetch dog breeds' });
  }
});

// Get cat breeds
app.get('/api/pets/cats', async (req, res) => {
  try {
    const { query } = req.query;
    const breeds = await petApiService.getCatBreeds(query);
    res.json(breeds);
  } catch (error) {
    console.error('Error fetching cat breeds:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pet care tips
app.get('/api/pets/care-tips', async (req, res) => {
  try {
    const { petType } = req.query;
    const tips = await petApiService.getPetCareTips(petType);
    res.json(tips);
  } catch (error) {
    console.error('Error fetching pet care tips:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get boarding information
app.get('/api/pets/boarding-info', (req, res) => {
  try {
    const boardingInfo = petApiService.getBoardingInfo();
    res.json(boardingInfo);
  } catch (error) {
    console.error('Error fetching boarding info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get grooming information
app.get('/api/pets/grooming-info', (req, res) => {
  try {
    const groomingInfo = petApiService.getGroomingInfo();
    res.json(groomingInfo);
  } catch (error) {
    console.error('Error fetching grooming info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    // Check if we should exclude completed bookings
    const { exclude } = req.query;
    let query = 'SELECT * FROM bookings';
    
    // If exclude=completed is specified, filter out completed bookings
    if (exclude === 'completed') {
      query += " WHERE status != 'completed'";
    }
    
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ECONNREFUSED') {
      res.status(503).json({ message: 'Database service unavailable' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Get booking by ID
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
  const {
    petName,
    petType,
    petBreed,
    petAge,
    ownerName,
    ownerEmail,
    ownerPhone,
    startDate,
    endDate,
    selectedRoom,
    timeSlot,
    additionalServices,
    specialRequirements,
    totalCost,
    status = 'pending', // Default status is pending
    serviceType = 'overnight', // Default service type is overnight
    selectedServiceType = null, // Specific service type for grooming
    selectedSize = null // Pet size category
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO bookings (
        pet_name, pet_type, pet_breed, pet_age, 
        owner_name, owner_email, owner_phone, 
        start_date, end_date, room_type, time_slot,
        additional_services, special_requirements, total_cost, status,
        service_type, selected_service_type, selected_size
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        petName, petType, petBreed, petAge,
        ownerName, ownerEmail, ownerPhone,
        startDate, endDate, selectedRoom, timeSlot,
        JSON.stringify(additionalServices), specialRequirements, totalCost, status,
        serviceType, selectedServiceType, selectedSize
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking
app.put('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const {
    petName,
    petType,
    petBreed,
    petAge,
    ownerName,
    ownerEmail,
    ownerPhone,
    startDate,
    endDate,
    selectedRoom,
    timeSlot,
    additionalServices,
    specialRequirements,
    totalCost,
    status
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE bookings SET 
        pet_name = ?, pet_type = ?, pet_breed = ?, pet_age = ?, 
        owner_name = ?, owner_email = ?, owner_phone = ?, 
        start_date = ?, end_date = ?, room_type = ?, time_slot = ?,
        additional_services = ?, special_requirements = ?, total_cost = ?, status = ?
      WHERE id = ?`,
      [
        petName, petType, petBreed, petAge,
        ownerName, ownerEmail, ownerPhone,
        startDate, endDate, selectedRoom, timeSlot,
        JSON.stringify(additionalServices), specialRequirements, totalCost, status,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    
    // Provide more detailed error messages based on the error type
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      res.status(503).json({ 
        message: 'Database connection error. Please try again later.',
        error: 'connection_issue',
        details: error.message
      });
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      res.status(500).json({ 
        message: 'Database authentication error. Please contact administrator.',
        error: 'auth_issue',
        details: error.message
      });
    } else {
      res.status(500).json({ 
        message: 'Server error while updating booking',
        error: 'server_error',
        details: error.message
      });
    }
  }
});

// Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Gemini AI endpoint for advanced AI responses
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, petType, topic } = req.body;
    
    if (!prompt && !(petType && topic)) {
      return res.status(400).json({ error: 'Either prompt or petType and topic are required' });
    }
    
    let response;
    
    if (prompt) {
      // Direct prompt to Gemini
      response = await geminiService.generateContent(prompt);
    } else if (petType && topic) {
      // Generate pet care advice
      response = await geminiService.generatePetCareAdvice(petType, topic);
    }
    
    if (response.status === 'success') {
      res.json(response);
    } else {
      res.status(500).json({
        text: 'Failed to generate AI response',
        status: 'error',
        error: response.error
      });
    }
  } catch (error) {
    console.error('Error generating AI content:', error);
    res.status(500).json({
      text: 'An error occurred while processing your request',
      status: 'error',
      error: error.message
    });
  }
});

// Email notification endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  
  try {
    // In a production environment, you would use a proper email service like Nodemailer
    // For this demo, we'll just log the email details and return success
    console.log('Email notification would be sent with the following details:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    
    // To implement actual email sending, you would use code like this:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text
    };
    
    await transporter.sendMail(mailOptions);
    */
    
    res.status(200).json({ message: 'Email notification sent successfully' });
  } catch (error) {
    console.error('Error sending email notification:', error);
    res.status(500).json({ message: 'Failed to send email notification' });
  }
});

// Server is already started by the startServer function above
// No need to start it again
app.get('/', (req, res) => {
  res.send('Pet Hotel API is running');
});

// Pet API Routes
// Get dog breeds
app.get('/api/pets/dogs', async (req, res) => {
  try {
    const dogBreeds = await petApiService.getDogBreeds();
    res.json(dogBreeds);
  } catch (error) {
    console.error('Error fetching dog breeds:', error);
    res.status(500).json({ error: 'Failed to fetch dog breeds' });
  }
});

// Get cat breeds
app.get('/api/pets/cats', async (req, res) => {
  try {
    const { query } = req.query;
    const breeds = await petApiService.getCatBreeds(query);
    res.json(breeds);
  } catch (error) {
    console.error('Error fetching cat breeds:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pet care tips
app.get('/api/pets/care-tips', async (req, res) => {
  try {
    const { petType } = req.query;
    const tips = await petApiService.getPetCareTips(petType);
    res.json(tips);
  } catch (error) {
    console.error('Error fetching pet care tips:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get boarding information
app.get('/api/pets/boarding-info', (req, res) => {
  try {
    const boardingInfo = petApiService.getBoardingInfo();
    res.json(boardingInfo);
  } catch (error) {
    console.error('Error fetching boarding info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get grooming information
app.get('/api/pets/grooming-info', (req, res) => {
  try {
    const groomingInfo = petApiService.getGroomingInfo();
    res.json(groomingInfo);
  } catch (error) {
    console.error('Error fetching grooming info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    // Check if we should exclude completed bookings
    const { exclude } = req.query;
    let query = 'SELECT * FROM bookings';
    
    // If exclude=completed is specified, filter out completed bookings
    if (exclude === 'completed') {
      query += " WHERE status != 'completed'";
    }
    
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ECONNREFUSED') {
      res.status(503).json({ message: 'Database service unavailable' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Get booking by ID
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
  const {
    petName,
    petType,
    petBreed,
    petAge,
    ownerName,
    ownerEmail,
    ownerPhone,
    startDate,
    endDate,
    selectedRoom,
    timeSlot,
    additionalServices,
    specialRequirements,
    totalCost,
    status = 'pending', // Default status is pending
    serviceType = 'overnight', // Default service type is overnight
    selectedServiceType = null, // Specific service type for grooming
    selectedSize = null // Pet size category
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO bookings (
        pet_name, pet_type, pet_breed, pet_age, 
        owner_name, owner_email, owner_phone, 
        start_date, end_date, room_type, time_slot,
        additional_services, special_requirements, total_cost, status,
        service_type, selected_service_type, selected_size
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        petName, petType, petBreed, petAge,
        ownerName, ownerEmail, ownerPhone,
        startDate, endDate, selectedRoom, timeSlot,
        JSON.stringify(additionalServices), specialRequirements, totalCost, status,
        serviceType, selectedServiceType, selectedSize
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking
app.put('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const {
    petName,
    petType,
    petBreed,
    petAge,
    ownerName,
    ownerEmail,
    ownerPhone,
    startDate,
    endDate,
    selectedRoom,
    timeSlot,
    additionalServices,
    specialRequirements,
    totalCost,
    status
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE bookings SET 
        pet_name = ?, pet_type = ?, pet_breed = ?, pet_age = ?, 
        owner_name = ?, owner_email = ?, owner_phone = ?, 
        start_date = ?, end_date = ?, room_type = ?, time_slot = ?,
        additional_services = ?, special_requirements = ?, total_cost = ?, status = ?
      WHERE id = ?`,
      [
        petName, petType, petBreed, petAge,
        ownerName, ownerEmail, ownerPhone,
        startDate, endDate, selectedRoom, timeSlot,
        JSON.stringify(additionalServices), specialRequirements, totalCost, status,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    
    // Provide more detailed error messages based on the error type
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      res.status(503).json({ 
        message: 'Database connection error. Please try again later.',
        error: 'connection_issue',
        details: error.message
      });
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      res.status(500).json({ 
        message: 'Database authentication error. Please contact administrator.',
        error: 'auth_issue',
        details: error.message
      });
    } else {
      res.status(500).json({ 
        message: 'Server error while updating booking',
        error: 'server_error',
        details: error.message
      });
    }
  }
});

// Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Gemini AI endpoint for advanced AI responses
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, petType, topic } = req.body;
    
    if (!prompt && !(petType && topic)) {
      return res.status(400).json({ error: 'Either prompt or petType and topic are required' });
    }
    
    let response;
    
    if (prompt) {
      // Direct prompt to Gemini
      response = await geminiService.generateContent(prompt);
    } else if (petType && topic) {
      // Generate pet care advice
      response = await geminiService.generatePetCareAdvice(petType, topic);
    }
    
    if (response.status === 'success') {
      res.json(response);
    } else {
      res.status(500).json({
        text: 'Failed to generate AI response',
        status: 'error',
        error: response.error
      });
    }
  } catch (error) {
    console.error('Error generating AI content:', error);
    res.status(500).json({
      text: 'An error occurred while processing your request',
      status: 'error',
      error: error.message
    });
  }
});

// Email notification endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  
  try {
    // In a production environment, you would use a proper email service like Nodemailer
    // For this demo, we'll just log the email details and return success
    console.log('Email notification would be sent with the following details:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    
    // To implement actual email sending, you would use code like this:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text
    };
    
    await transporter.sendMail(mailOptions);
    */
    
    res.status(200).json({ message: 'Email notification sent successfully' });
  } catch (error) {
    console.error('Error sending email notification:', error);
    res.status(500).json({ message: 'Failed to send email notification' });
  }
});

// Server is already started by the startServer function above
// No need to start it again
app.get('/', (req, res) => {
  res.send('Pet Hotel API is running');
});

// Pet API Routes
// Get dog breeds
app.get('/api/pets/dogs', async (req, res) => {
  try {
    const dogBreeds = await petApiService.getDogBreeds();
    res.json(dogBreeds);
  } catch (error) {
    console.error('Error fetching dog breeds:', error);
    res.status(500).json({ error: 'Failed to fetch dog breeds' });
  }
});

// Get cat breeds
app.get('/api/pets/cats', async (req, res) => {
  try {
    const { query } = req.query;
    const breeds = await petApiService.getCatBreeds(query);
    res.json(breeds);
  } catch (error) {
    console.error('Error fetching cat breeds:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pet care tips
app.get('/api/pets/care-tips', async (req, res) => {
  try {
    const { petType } = req.query;
    const tips = await petApiService.getPetCareTips(petType);
    res.json(tips);
  } catch (error) {
    console.error('Error fetching pet care tips:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get boarding information
app.get('/api/pets/boarding-info', (req, res) => {
  try {
    const boardingInfo = petApiService.getBoardingInfo();
    res.json(boardingInfo);
  } catch (error) {
    console.error('Error fetching boarding info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get grooming information
app.get('/api/pets/grooming-info', (req, res) => {
  try {
    const groomingInfo = petApiService.getGroomingInfo();
    res.json(groomingInfo);
  } catch (error) {
    console.error('Error fetching grooming info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    // Check if we should exclude completed bookings
    const { exclude } = req.query;
    let query = 'SELECT * FROM bookings';
    
    // If exclude=completed is specified, filter out completed bookings
    if (exclude === 'completed') {
      query += " WHERE status != 'completed'";
    }
    
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ECONNREFUSED') {
      res.status(503).json({ message: 'Database service unavailable' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Get booking by ID
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
  const {
    petName,
    petType,
    petBreed,
    petAge,
    ownerName,
    ownerEmail,
    ownerPhone,
    startDate,
    endDate,
    selectedRoom,
    timeSlot,
    additionalServices,
    specialRequirements,
    totalCost,
    status = 'pending', // Default status is pending
    serviceType = 'overnight', // Default service type is overnight
    selectedServiceType = null, // Specific service type for grooming
    selectedSize = null // Pet size category
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO bookings (
        pet_name, pet_type, pet_breed, pet_age, 
        owner_name, owner_email, owner_phone, 
        start_date, end_date, room_type, time_slot,
        additional_services, special_requirements, total_cost, status,
        service_type, selected_service_type, selected_size
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        petName, petType, petBreed, petAge,
        ownerName, ownerEmail, ownerPhone,
        startDate, endDate, selectedRoom, timeSlot,
        JSON.stringify(additionalServices), specialRequirements, totalCost, status,
        serviceType, selectedServiceType, selectedSize
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking
app.put('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const {
    petName,
    petType,
    petBreed,
    petAge,
    ownerName,
    ownerEmail,
    ownerPhone,
    startDate,
    endDate,
    selectedRoom,
    timeSlot,
    additionalServices,
    specialRequirements,
    totalCost,
    status
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE bookings SET 
        pet_name = ?, pet_type = ?, pet_breed = ?, pet_age = ?, 
        owner_name = ?, owner_email = ?, owner_phone = ?, 
        start_date = ?, end_date = ?, room_type = ?, time_slot = ?,
        additional_services = ?, special_requirements = ?, total_cost = ?, status = ?
      WHERE id = ?`,
      [
        petName, petType, petBreed, petAge,
        ownerName, ownerEmail, ownerPhone,
        startDate, endDate, selectedRoom, timeSlot,
        JSON.stringify(additionalServices), specialRequirements, totalCost, status,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    
    // Provide more detailed error messages based on the error type
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      res.status(503).json({ 
        message: 'Database connection error. Please try again later.',
        error: 'connection_issue',
        details: error.message
      });
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      res.status(500).json({ 
        message: 'Database authentication error. Please contact administrator.',
        error: 'auth_issue',
        details: error.message
      });
    } else {
      res.status(500).json({ 
        message: 'Server error while updating booking',
        error: 'server_error',
        details: error.message
      });
    }
  }
});

// Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Gemini AI endpoint for advanced AI responses
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, petType, topic } = req.body;
    
    if (!prompt && !(petType && topic)) {
      return res.status(400).json({ error: 'Either prompt or petType and topic are required' });
    }
    
    let response;
    
    if (prompt) {
      // Direct prompt to Gemini
      response = await geminiService.generateContent(prompt);
    } else if (petType && topic) {
      // Generate pet care advice
      response = await geminiService.generatePetCareAdvice(petType, topic);
    }
    
    if (response.status === 'success') {
      res.json(response);
    } else {
      res.status(500).json({
        text: 'Failed to generate AI response',
        status: 'error',
        error: response.error
      });
    }
  } catch (error) {
    console.error('Error generating AI content:', error);
    res.status(500).json({
      text: 'An error occurred while processing your request',
      status: 'error',
      error: error.message
    });
  }
});

// Email notification endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  
  try {
    // In a production environment, you would use a proper email service like Nodemailer
    // For this demo, we'll just log the email details and return success
    console.log('Email notification would be sent with the following details:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    
    // To implement actual email sending, you would use code like this:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text
    };
    
    await transporter.sendMail(mailOptions);
    */
    
    res.status(200).json({ message: 'Email notification sent successfully' });
  } catch (error) {
    console.error('Error sending email notification:', error);
    res.status(500).json({ message: 'Failed to send email notification' });
  }
});

// Server is already started by the startServer function above
// No need to start it again
app.get('/', (req, res) => {
  res.send('Pet Hotel API is running');
});

// Pet API Routes
// Get dog breeds
app.get('/api/pets/dogs', async (req, res) => {
  try {
    const dogBreeds = await petApiService.getDogBreeds();
    res.json(dogBreeds);
  } catch (error) {
    console.error('Error fetching dog breeds:', error);
    res.status(500).json({ error: 'Failed to fetch dog breeds' });
  }
});

// Get cat breeds
app.get('/api/pets/cats', async (req, res) => {
  try {
    const { query } = req.query;
    const breeds = await petApiService.getCatBreeds(query);
    res.json(breeds);
  } catch (error) {
    console.error('Error fetching cat breeds:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pet care tips
app.get('/api/pets/care-tips', async (req, res) => {
  try {
    const { petType } = req.query;
    const tips = await petApiService.getPetCareTips(petType);
    res.json(tips);
  } catch (error) {
    console.error('Error fetching pet care tips:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get boarding information
app.get('/api/pets/boarding-info', (req, res) => {
  try {
    const boardingInfo = petApiService.getBoardingInfo();
    res.json(boardingInfo);
  } catch (error) {
    console.error('Error fetching boarding info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get grooming information
app.get('/api/pets/grooming-info', (req, res) => {
  try {
    const groomingInfo = petApiService.getGroomingInfo();
    res.json(groomingInfo);
  } catch (error) {
    console.error('Error fetching grooming info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    // Check if we should exclude completed bookings
    const { exclude } = req.query;
    let query = 'SELECT * FROM bookings';
    
    // If exclude=completed is specified, filter out completed bookings
    if (exclude === 'completed') {
      query += " WHERE status != 'completed'";
    }
    
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ECONNREFUSED') {
      res.status(503).json({ message: 'Database service unavailable' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Get booking by ID
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
  const {
    petName,
    petType,
    petBreed,
    petAge,
    ownerName,
    ownerEmail,
    ownerPhone,
    startDate,
    endDate,
    selectedRoom,
    timeSlot,
    additionalServices,
    specialRequirements,
    totalCost,
    status = 'pending', // Default status is pending
    serviceType = 'overnight', // Default service type is overnight
    selectedServiceType = null, // Specific service type for grooming
    selectedSize = null // Pet size category
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO bookings (
        pet_name, pet_type, pet_breed, pet_age, 
        owner_name, owner_email, owner_phone, 
        start_date, end_date, room_type, time_slot,
        additional_services, special_requirements, total_cost, status,
        service_type, selected_service_type, selected_size
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        petName, petType, petBreed, petAge,
        ownerName, ownerEmail, ownerPhone,
        startDate, endDate, selectedRoom, timeSlot,
        JSON.stringify(additionalServices), specialRequirements, totalCost, status,
        serviceType, selectedServiceType, selectedSize
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking
app.put('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const {
    petName,
    petType,
    petBreed,
    petAge,
    ownerName,
    ownerEmail,
    ownerPhone,
    startDate,
    endDate,
    selectedRoom,
    timeSlot,
    additionalServices,
    specialRequirements,
    totalCost,
    status
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE bookings SET 
        pet_name = ?, pet_type = ?, pet_breed = ?, pet_age = ?, 
        owner_name = ?, owner_email = ?, owner_phone = ?, 
        start_date = ?, end_date = ?, room_type = ?, time_slot = ?,
        additional_services = ?, special_requirements = ?, total_cost = ?, status = ?
      WHERE id = ?`,
      [
        petName, petType, petBreed, petAge,
        ownerName, ownerEmail, ownerPhone,
        startDate, endDate, selectedRoom, timeSlot,
        JSON.stringify(additionalServices), specialRequirements, totalCost, status,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    
    // Provide more detailed error messages based on the error type
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      res.status(503).json({ 
        message: 'Database connection error. Please try again later.',
        error: 'connection_issue',
        details: error.message
      });
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      res.status(500).json({ 
        message: 'Database authentication error. Please contact administrator.',
        error: 'auth_issue',
        details: error.message
      });
    } else {
      res.status(500).json({ 
        message: 'Server error while updating booking',
        error: 'server_error',
        details: error.message
      });
    }
  }
});

// Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Gemini AI endpoint for advanced AI responses
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, petType, topic } = req.body;
    
    if (!prompt && !(petType && topic)) {
      return res.status(400).json({ error: 'Either prompt or petType and topic are required' });
    }
    
    let response;
    
    if (prompt) {
      // Direct prompt to Gemini
      response = await geminiService.generateContent(prompt);
    } else if (petType && topic) {
      // Generate pet care advice
      response = await geminiService.generatePetCareAdvice(petType, topic);
    }
    
    if (response.status === 'success') {
      res.json(response);
    } else {
      res.status(500).json({
        text: 'Failed to generate AI response',
        status: 'error',
        error: response.error
      });
    }
  } catch (error) {
    console.error('Error generating AI content:', error);
    res.status(500).json({
      text: 'An error occurred while processing your request',
      status: 'error',
      error: error.message
    });
  }
});

// Email notification endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  
  try {
    // In a production environment, you would use a proper email service like Nodemailer
    // For this demo, we'll just log the email details and return success
    console.log('Email notification would be sent with the following details:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    
    // To implement actual email sending, you would use code like this:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text
    };
    
    await transporter.sendMail(mailOptions);
    */
    
    res.status(200).json({ message: 'Email notification sent successfully' });
  } catch (error) {
    console.error('Error sending email notification:', error);
    res.status(500).json({ message: 'Failed to send email notification' });
  }
});

// Server is already started by the startServer function above
// No need to start it again
app.get('/', (req, res) => {
  res.send('Pet Hotel API is running');
});

// Pet API Routes
// Get dog breeds
app.get('/api/pets/dogs', async (req, res) => {
  try {
    const dogBreeds = await petApiService.getDogBreeds();
    res.json(dogBreeds);
  } catch (error) {
    console.error('Error fetching dog breeds:', error);
    res.status(500).json({ error: 'Failed to fetch dog breeds' });
  }
});

// Get cat breeds
app.get('/api/pets/cats', async (req, res) => {
  try {
    const { query } = req.query;
    const breeds = await petApiService.getCatBreeds(query);
    res.json(breeds);
  } catch (error) {
    console.error('Error fetching cat breeds:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pet care tips
app.get('/api/pets/care-tips', async (req, res) => {
  try {
    const { petType } = req.query;
    const tips = await petApiService.getPetCareTips(petType);
    res.json(tips);
  } catch (error) {
    console.error('Error fetching pet care tips:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get boarding information
app.get('/api/pets/boarding-info', (req, res) => {
  try {
    const boardingInfo = petApiService.getBoardingInfo();
    res.json(boardingInfo);
  } catch (error) {
    console.error('Error fetching boarding info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get grooming information
app.get('/api/pets/grooming-info', (req, res) => {
  try {
    const groomingInfo = petApiService.getGroomingInfo();
    res.json(groomingInfo);
  } catch (error) {
    console.error('Error fetching grooming info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    // Check if we should exclude completed bookings
    const { exclude } = req.query;
    let query = 'SELECT * FROM bookings';
    
    // If exclude=completed is specified, filter out completed bookings
    if (exclude === 'completed') {
      query += " WHERE status != 'completed'";
    }
    
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ECONNREFUSED') {
      res.status(503).json({ message: 'Database service unavailable' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Get booking by ID
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
  const {
    petName,
    petType,
    petBreed,
    petAge,
    ownerName,
    ownerEmail,
    ownerPhone,
    startDate,
    endDate,
    selectedRoom,
    timeSlot,
    additionalServices,
    specialRequirements,
    totalCost,
    status = 'pending', // Default status is pending
    serviceType = 'overnight', // Default service type is overnight
    selectedServiceType = null, // Specific service type for grooming
    selectedSize = null // Pet size category
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO bookings (
        pet_name, pet_type, pet_breed, pet_age, 
        owner_name, owner_email, owner_phone, 
        start_date, end_date, room_type, time_slot,
        additional_services, special_requirements, total_cost, status,
        service_type, selected_service_type, selected_size
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        petName, petType, petBreed, petAge,
        ownerName, ownerEmail, ownerPhone,
        startDate, endDate, selectedRoom, timeSlot,
        JSON.stringify(additionalServices), specialRequirements, totalCost, status,
        serviceType, selectedServiceType, selectedSize
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking
app.put('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const {
    petName,
    petType,
    petBreed,
    petAge,
    ownerName,
    ownerEmail,
    ownerPhone,
    startDate,
    endDate,
    selectedRoom,
    timeSlot,
    additionalServices,
    specialRequirements,
    totalCost,
    status
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE bookings SET 
        pet_name = ?, pet_type = ?, pet_breed = ?, pet_age = ?, 
        owner_name = ?, owner_email = ?, owner_phone = ?, 
        start_date = ?, end_date = ?, room_type = ?, time_slot = ?,
        additional_services = ?, special_requirements = ?, total_cost = ?, status = ?
      WHERE id = ?`,
      [
        petName, petType, petBreed, petAge,
        ownerName, ownerEmail, ownerPhone,
        startDate, endDate, selectedRoom, timeSlot,
        JSON.stringify(additionalServices), specialRequirements, totalCost, status,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    
    // Provide more detailed error messages based on the error type
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      res.status(503).json({ 
        message: 'Database connection error. Please try again later.',
        error: 'connection_issue',
        details: error.message
      });
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      res.status(500).json({ 
        message: 'Database authentication error. Please contact administrator.',
        error: 'auth_issue',
        details: error.message
      });
    } else {
      res.status(500).json({ 
        message: 'Server error while updating booking',
        error: 'server_error',
        details: error.message
      });
    }
  }
});

// Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Gemini AI endpoint for advanced AI responses
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, petType, topic } = req.body;
    
    if (!prompt && !(petType && topic)) {
      return res.status(400).json({ error: 'Either prompt or petType and topic are required' });
    }
    
    let response;
    
    if (prompt) {
      // Direct prompt to Gemini
      response = await geminiService.generateContent(prompt);
    } else if (petType && topic) {
      // Generate pet care advice
      response = await geminiService.generatePetCareAdvice(petType, topic);
    }
    
    if (response.status === 'success') {
      res.json(response);
    } else {
      res.status(500).json({
        text: 'Failed to generate AI response',
        status: 'error',
        error: response.error
      });
    }
  } catch (error) {
    console.error('Error generating AI content:', error);
    res.status(500).json({
      text: 'An error occurred while processing your request',
      status: 'error',
      error: error.message
    });
  }
});

// Email notification endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  
  try {
    // In a production environment, you would use a proper email service like Nodemailer
    // For this demo, we'll just log the email details and return success
    console.log('Email notification would be sent with the following details:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    
    // To implement actual email sending, you would use code like this:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text
    };
    
    await transporter.sendMail(mailOptions);
    */
    
    res.status(200).json({ message: 'Email notification sent successfully' });
  } catch (error) {
    console.error('Error sending email notification:', error);
    res.status(500).json({ message: 'Failed to send email notification' });
  }
});

// Server is already started by the startServer function above
// No need to start it again
app.get('/', (req, res) => {
  res.send('Pet Hotel API is running');
});

// Pet API Routes
// Get dog breeds
app.get('/api/pets/dogs', async (req, res) => {
  try {
    const dogBreeds = await petApiService.getDogBreeds();
    res.json(dogBreeds);
  } catch (error) {
    console.error('Error fetching dog breeds:', error);
    res.status(500).json({ error: 'Failed to fetch dog breeds' });
  }
});

// Get cat breeds
app.get('/api/pets/cats', async (req, res) => {
  try {
    const { query } = req.query;
    const breeds = await petApiService.getCatBreeds(query);
    res.json(breeds);
  } catch (error) {
    console.error('Error fetching cat breeds:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pet care tips
app.get('/api/pets/care-tips', async (req, res) => {
  try {
    const { petType } = req.query;
    const tips = await petApiService.getPetCareTips(petType);
    res.json(tips);
  } catch (error) {
    console.error('Error fetching pet care tips:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get boarding information
app.get('/api/pets/boarding-info', (req, res) => {
  try {
    const boardingInfo = petApiService.getBoardingInfo();
    res.json(boardingInfo);
  } catch (error) {
    console.error('Error fetching boarding info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get grooming information
app.get('/api/pets/grooming-info', (req, res) => {
  try {
    const groomingInfo = petApiService.getGroomingInfo();
    res.json(groomingInfo);
  } catch (error) {
    console.error('Error fetching grooming info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    // Check if we should exclude completed bookings
    const { exclude } = req.query;
    let query = 'SELECT * FROM bookings';
    
    // If exclude=completed is specified, filter out completed bookings
    if (exclude === 'completed') {
      query += " WHERE status != 'completed'";
    }
    
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ECONNREFUSED') {
      res.status(503).json({ message: 'Database service unavailable' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Get booking by ID
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
  const {
    petName,
    petType,
    petBreed,
    petAge,
    ownerName,
    ownerEmail,
    ownerPhone,
    startDate,
    endDate,
    selectedRoom,
    timeSlot,
    additionalServices,
    specialRequirements,
    totalCost,
    status = 'pending', // Default status is pending
    serviceType = 'overnight', // Default service type is overnight
    selectedServiceType = null, // Specific service type for grooming
    selectedSize = null // Pet size category
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO bookings (
        pet_name, pet_type, pet_breed, pet_age, 
        owner_name, owner_email, owner_phone, 
        start_date, end_date, room_type, time_slot,
        additional_services, special_requirements, total_cost, status,
        service_type, selected_service_type, selected_size
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        petName, petType, petBreed, petAge,
        ownerName, ownerEmail, ownerPhone,
        startDate, endDate, selectedRoom, timeSlot,
        JSON.stringify(additionalServices), specialRequirements, totalCost, status,
        serviceType, selectedServiceType, selectedSize
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking
app.put('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const {
    petName,
    petType,
    petBreed,
    petAge,
    ownerName,
    ownerEmail,
    ownerPhone,
    startDate,
    endDate,
    selectedRoom,
    timeSlot,
    additionalServices,
    specialRequirements,
    totalCost,
    status
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE bookings SET 
        pet_name = ?, pet_type = ?, pet_breed = ?, pet_age = ?, 
        owner_name = ?, owner_email = ?, owner_phone = ?, 
        start_date = ?, end_date = ?, room_type = ?, time_slot = ?,
        additional_services = ?, special_requirements = ?, total_cost = ?, status = ?
      WHERE id = ?`,
      [
        petName, petType, petBreed, petAge,
        ownerName, ownerEmail, ownerPhone,
        startDate, endDate, selectedRoom, timeSlot,
        JSON.stringify(additionalServices), specialRequirements, totalCost, status,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    
    // Provide more detailed error messages based on the error type
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      res.status(503).json({ 
        message: 'Database connection error. Please try again later.',
        error: 'connection_issue',
        details: error.message
      });
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      res.status(500).json({ 
        message: 'Database authentication error. Please contact administrator.',
        error: 'auth_issue',
        details: error.message
      });
    } else {
      res.status(500).json({ 
        message: 'Server error while updating booking',
        error: 'server_error',
        details: error.message
      });
    }
  }
});

// Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Gemini AI endpoint for advanced AI responses
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, petType, topic } = req.body;
    
    if (!prompt && !(petType && topic)) {
      return res.status(400).json({ error: 'Either prompt or petType and topic are required' });
    }
    
    let response;
    
    if (prompt) {
      // Direct prompt to Gemini
      response = await geminiService.generateContent(prompt);
    } else if (petType && topic) {
      // Generate pet care advice
      response = await geminiService.generatePetCareAdvice(petType, topic);
    }
    
    if (response.status === 'success') {
      res.json(response);
    } else {
      res.status(500).json({
        text: 'Failed to generate AI response',
        status: 'error',
        error: response.error
      });
    }
  } catch (error) {
    console.error('Error generating AI content:', error);
    res.status(500).json({
      text: 'An error occurred while processing your request',
      status: 'error',
      error: error.message
    });
  }
});

// Email notification endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  
  try {
    // In a production environment, you would use a proper email service like Nodemailer
    // For this demo, we'll just log the email details and return success
    console.log('Email notification would be sent with the following details:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    
    // To implement actual email sending, you would use code like this:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text
    };
    
    await transporter.sendMail(mailOptions);
    */
    
    res.status(200).json({ message: 'Email notification sent successfully' });
  } catch (error) {
    console.error('Error sending email notification:', error);
    res.status(500).json({ message: 'Failed to send email notification' });
  }
});

// Server is already started by the startServer function above
// No need to start it again
app.get('/', (req, res) => {
  res.send('Pet Hotel API is running');
});

// Pet API Routes
// Get dog breeds
app.get('/api/pets/dogs', async (req, res) => {
  try {
    const dogBreeds = await petApiService.getDogBreeds();
    res.json(dogBreeds);
  } catch (error) {
    console.error('Error fetching dog breeds:', error);
    res.status(500).json({ error: 'Failed to fetch dog breeds' });
  }
});

// Get cat breeds
app.get('/api/pets/cats', async (req, res) => {
  try {
    const { query } = req.query;
    const breeds = await petApiService.getCatBreeds(query);
    res.json(breeds);
  } catch (error) {
    console.error('Error fetching cat breeds:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pet care tips
app.get('/api/pets/care-tips', async (req, res) => {
  try {
    const { petType } = req.query;
    const tips = await petApiService.getPetCareTips(petType);
    res.json(tips);
  } catch (error) {
    console.error('Error fetching pet care tips:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get boarding information
app.get('/api/pets/boarding-info', (req, res) => {
  try {
    const boardingInfo = petApiService.getBoardingInfo();
    res.json(boardingInfo);
  } catch (error) {
    console.error('Error fetching boarding info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get grooming information
app.get('/api/pets/grooming-info', (req, res) => {
  try {
    const groomingInfo = petApiService.getGroomingInfo();
    res.json(groomingInfo);
  } catch (error) {
    console.error('Error fetching grooming info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    // Check if we should exclude completed bookings
    const { exclude } = req.query;
    let query = 'SELECT * FROM bookings';
    
    // If exclude=completed is specified, filter out completed bookings
    if (exclude === 'completed') {
      query += " WHERE status != 'completed'";
    }
    
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ECONNREFUSED') {
      res.status(503).json({ message: 'Database service unavailable' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Get booking by ID
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
  const {
    petName,
    petType,
    petBreed,
    petAge,
    ownerName,
    ownerEmail,
    ownerPhone,
    startDate,
    endDate,
    selectedRoom,
    timeSlot,
    additionalServices,
    specialRequirements,
    totalCost,
    status = 'pending', // Default status is pending
    serviceType = 'overnight', // Default service type is overnight
    selectedServiceType = null, // Specific service type for grooming
    selectedSize = null // Pet size category
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO bookings (
        pet_name, pet_type, pet_breed, pet_age, 
        owner_name, owner_email, owner_phone, 
        start_date, end_date, room_type, time_slot,
        additional_services, special_requirements, total_cost, status,
        service_type, selected_service_type, selected_size
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        petName, petType, petBreed, petAge,
        ownerName, ownerEmail, ownerPhone,
        startDate, endDate, selectedRoom, timeSlot,
        JSON.stringify(additionalServices), specialRequirements, totalCost, status,
        serviceType, selectedServiceType, selectedSize
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking
app.put('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const {
    petName,
    petType,
    petBreed,
    petAge,
    ownerName,
    ownerEmail,
    ownerPhone,
    startDate,
    endDate,
    selectedRoom,
    timeSlot,
    additionalServices,
    specialRequirements,
    totalCost,
    status
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE bookings SET 
        pet_name = ?, pet_type = ?, pet_breed = ?, pet_age = ?, 
        owner_name = ?, owner_email = ?, owner_phone = ?, 
        start_date = ?, end_date = ?, room_type = ?, time_slot = ?,
        additional_services = ?, special_requirements = ?, total_cost = ?, status = ?
      WHERE id = ?`,
      [
        petName, petType, petBreed, petAge,
        ownerName, ownerEmail, ownerPhone,
        startDate, endDate, selectedRoom, timeSlot,
        JSON.stringify(additionalServices), specialRequirements, totalCost, status,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    
    // Provide more detailed error messages based on the error type
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      res.status(503).json({ 
        message: 'Database connection error. Please try again later.',
        error: 'connection_issue',
        details: error.message
      });
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      res.status(500).json({ 
        message: 'Database authentication error. Please contact administrator.',
        error: 'auth_issue',
        details: error.message
      });
    } else {
      res.status(500).json({ 
        message: 'Server error while updating booking',
        error: 'server_error',
        details: error.message
      });
    }
  }
});

// Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Gemini AI endpoint for advanced AI responses
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, petType, topic } = req.body;
    
    if (!prompt && !(petType && topic)) {
      return res.status(400).json({ error: 'Either prompt or petType and topic are required' });
    }
    
    let response;
    
    if (prompt) {
      // Direct prompt to Gemini
      response = await geminiService.generateContent(prompt);
    } else if (petType && topic) {
      // Generate pet care advice
      response = await geminiService.generatePetCareAdvice(petType, topic);
    }
    
    if (response.status === 'success') {
      res.json(response);
    } else {
      res.status(500).json({
        text: 'Failed to generate AI response',
        status: 'error',
        error: response.error
      });
    }
  } catch (error) {
    console.error('Error generating AI content:', error);
    res.status(500).json({
      text: 'An error occurred while processing your request',
      status: 'error',
      error: error.message
    });
  }
});

// Email notification endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  
  try {
    // In a production environment, you would use a proper email service like Nodemailer
    // For this demo, we'll just log the email details and return success
    console.log('Email notification would be sent with the following details:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    
    // To implement actual email sending, you would use code like this:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text
    };
    
    await transporter.sendMail(mailOptions);
    */
    
    res.status(200).json({ message: 'Email notification sent successfully' });
  } catch (error) {
    console.error('Error sending email notification:', error);
    res.status(500).json({ message: 'Failed to send email notification' });
  }
});

// Server is already started by the startServer function above
// No need to start it again
app.get('/', (req, res) => {
  res.send('Pet Hotel API is running');
});

// Pet API Routes
// Get dog breeds
app.get('/api/pets/dogs', async (req, res) => {
  try {
    const dogBreeds = await petApiService.getDogBreeds();
    res.json(dogBreeds);
  } catch (error) {
    console.error('Error fetching dog breeds:', error);
    res.status(500).json({ error: 'Failed to fetch dog breeds' });
  }
});