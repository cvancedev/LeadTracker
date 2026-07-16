# Lead Tracker

A small personal customer follow-up tracker built with Next.js, TypeScript, Tailwind CSS, Firebase Authentication, and Cloud Firestore.

## Firebase setup

1. Create a Firebase project and a web app.
2. Enable Email/Password in Firebase Authentication and create the user account.
3. Create a Cloud Firestore database.
4. Copy `.env.example` to `.env.local` and add the Firebase web configuration values.
5. Deploy `firestore.rules` to restrict each user's leads to `users/{uid}/leads`.

## Development

```bash
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd run dev`, `npm.cmd run lint`, and `npm.cmd run build` if script execution policy blocks `npm.ps1`.

## Validation

```bash
npm run lint
npm run build
```
