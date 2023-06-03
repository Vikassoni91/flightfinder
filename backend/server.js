const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 5000;
app.use(express.json());

const password = encodeURIComponent('Vikas@flight24');
const mongoUrl = `mongodb+srv://Vikassoni:${password}@flightfinder.gnskk9x.mongodb.net/?retryWrites=true&w=majority`

// Connect to MongoDB
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Defined Flight schema
const flightSchema = new mongoose.Schema({
  origin: String,
  destination: String,
  airline: String,
  price: Number,
});

const Flight = mongoose.model('Flight', flightSchema);

// Handle POST request to submit flight data
app.post('/putflights', (req, res) => {
  const { origin, destination, airline, price } = req.body;

  const flight = new Flight({ origin, destination, airline, price });

  flight.save()
    .then(() => res.send(req.body))
    .catch((err) => {
      console.error('Error saving flight:', err);
      res.sendStatus(500);
    });
});

// Handle GET request to retrieve flight data   
app.get('/getflights', (req, res) => {
    const { origin, destination } = req.query;
    Flight.find({ origin, destination })
      .then((flights) => {
        const flightData = {};
        flights.forEach((flight) => {
          flightData[flight.airline] = flight.price;
        });
        res.json(flightData);
      })
      .catch((err) => {
        console.error('Error retrieving flights:', err);
        res.sendStatus(500);
      });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
