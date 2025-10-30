# Dev Events Next.js App

This is a Next.js app. To run locally:

```bash
npm install
npm run dev
```

Environment variables (create a local .env or .env.local):

- NEXT_PUBLIC_POSTHOG_KEY
- NEXT_PUBLIC_POSTHOG_HOST (e.g. https://us.i.posthog.com)
- MONGODB_URI
- CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET

Example HTTPie upload (multipart form-data):

```bash
http --form POST :3000/api/events \
  title='Cloud Event' description='...' venue='...' location='SF' date='2025-04-10' time='09:00' mode='hybrid' \
  agenda='["9-10 Intro","10-12 Talks"]' tags='cloud,devops' organizer='Google' \
  image@/absolute/path/to/event1.png
```

Production build:

```bash
npm run build
npm start
```
