# openjdk-dashboard-v2

The next gen download dashboard for AdoptOpenJDK statistics

## Development

For local development with hot reloading and fast builds:

``` bash
npm install
npm start
```

- Open [http://localhost:3000](http://localhost:3000)
- Uses Parcel's secure development server with hot module replacement
- Automatically rebuilds on file changes

## Production Testing

To test the production build locally:

``` bash
npm run build
npm run serve
```

- Uses the secure Express server with rate limiting
- Serves optimized static files from `./dist`
- Mimics production environment for testing

## Deployment

For GitHub Pages deployment (automatic via GitHub Actions):

``` bash
npm run build
```

- Generates optimized static files in `./dist`
- Files are automatically deployed to GitHub Pages on push to `master`
- Includes `CNAME` and `404.html` for SPA routing support

## Tech Stack

- **React 19** with modern functional components and hooks
- **Ant Design 5** for UI components  
- **Highcharts 11** for data visualization
- **Parcel v2** for bundling and development server
- **Express.js** with rate limiting and security features for production testing
- **AdoptOpenJDK v3 API** for download statistics data

## Security Features

- **Rate limiting** - 100 requests per IP per 15 minutes to prevent DoS attacks
- **Secure static file serving** - Only serves built assets, no source code exposure
- **Modern GitHub Actions** - Automated deployment with security best practices
