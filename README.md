# openjdk-dashboard-v2

The next gen download dashboard for AdoptOpenJDK statistics

## Local run/development steps

``` bash
npm install
npm start
```

- open [http://localhost:3000](http://localhost:3000)

## Deployment

- Compile and generate static files

``` bash
npm run build
```

- serve ./dist

## Tech Stack

- **React 19** with modern functional components and hooks
- **Ant Design 5** for UI components  
- **Highcharts 11** for data visualization
- **Parcel v2** for bundling and development server
- **AdoptOpenJDK v3 API** for download statistics data
