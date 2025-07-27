const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const rateLimit = require('express-rate-limit')
const path = require('path')

let app = express()

// Rate limiting to prevent DoS attacks on file access
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply rate limiting to all requests
app.use(limiter)

// Serve only specific safe directories instead of entire current directory
// Only serve the built files from dist folder for security
app.use(express.static('dist'))

// Fallback to index.html for SPA routing with rate limiting protection
app.get('*', (req, res) => {
  // Serve from dist folder for production builds
  const indexPath = path.join(__dirname, 'dist', 'index.html')
  res.sendFile(indexPath, (err) => {
    if (err) {
      // Fallback to root index.html if dist doesn't exist (development)
      res.sendFile(path.join(__dirname, 'index.html'))
    }
  })
})

app.listen(Number(process.env.PORT || 3000), () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`)
})