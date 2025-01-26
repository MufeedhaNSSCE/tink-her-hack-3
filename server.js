const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files (HTML, JS)

let specialDates = [];

// Function to send email
function sendEmail(event) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'youremail@gmail.com',  // Replace with your email
            pass: 'yourpassword'  // Replace with your email password
        }
    });

    const mailOptions = {
        from: 'youremail@gmail.com',
        to: 'recipientemail@gmail.com',  // Replace with recipient's email
        subject: `Reminder: Special Event on ${event.date}`,
        text: `Hello! Just a reminder that ${event.name} is coming up on ${event.date}. Event Description: ${event.description}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// Route to add a special date
app.post('/addSpecialDate', (req, res) => {
    const { date, name, description } = req.body;
    if (date && name && description) {
        specialDates.push({ date, name, description });
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Function to check dates and send reminders
function checkSpecialDates() {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    specialDates.forEach(event => {
        if (event.date === today) {
            sendEmail(event); // Send email if the date matches today
        }
    });
}

// Check special dates every 24 hours
setInterval(checkSpecialDates, 24 * 60 * 60 * 1000);  // Run daily

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
