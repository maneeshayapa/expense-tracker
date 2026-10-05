# Ledgerly - Expense Tracker

React + Vite + React Router + Recharts with Firebase Authentication and Cloud
Firestore.

    npm install
    npm run dev

Open http://localhost:5173 and register or log in with a Firebase Authentication
account.

## Firebase configuration

The local `.env` file contains the Firebase web app configuration and is ignored
by Git. To configure another checkout, copy `.env.example` to `.env` and fill in
the values from Firebase Console → Project settings → Your apps.

These `VITE_` values are included in the browser bundle; they are not private
server-side secrets. Restrict the Firebase API key to the required APIs and
secure user data with Firebase Authentication and Firestore security rules.
Never put service-account keys or other server credentials in a Vite `.env`
file.

## Firestore security rules

Transactions are stored at `users/{uid}/transactions/{transactionId}`. The rules
in `firestore.rules` allow an authenticated user to access only the transactions
under their own UID. Deploy them to the configured Firebase project after
signing in to the Firebase CLI:

    firebase deploy --only firestore:rules

If the Firebase project is different, update `.firebaserc` before deployment.
