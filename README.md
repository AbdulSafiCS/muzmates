#Muzmates

A modern roommate & housing marketplace built with React Native (Expo) and Firebase.

##Description

Muzmates lets users browse, create, and manage room/house listings with real-time updates. It uses Firebase Authentication, Firestore, and Storage for profiles and listings, plus Google Places Autocomplete for clean address entry. The UI is mobile-first with an image gallery, clean forms, and toast notifications.

##Key Features

1. Authentication
2. Email & password
3. Phone (SMS) sign-in (see setup notes below not yet ready0
4. Realtime data with Firestore (users, listings)
5. CRUD for listings (create, edit, browse)
6. Image uploads to Firebase Storage (profile & listing photos)
7. Address input with Google Places Autocomplete
8. Image gallery with swipeable navigation
9. Notifications via react-native-toast-message
10. Expo Router & Context-based AuthContext for clean state management
11. Responsive UI with react-native-responsive-screen and icon packs (Ionicons, AntDesign)


#Why?

Finding a compatible roommate or the right rental is hard. Muzmates streamlines the process with a focused mobile experience, real-time syncing, and straightforward tools to create and manage listings.

#Tech Stack

1. App: React Native (Expo)
2. Navigation: Expo Router
3. State/Auth: React Context + Firebase Auth
4. Database: Firebase Firestore
5. Storage: Firebase Storage
6. Places: react-native-google-places-autocomplete (Google Maps Platform)
7. UI Utils: react-native-responsive-screen, react-native-toast-message, @expo/vector-icons

8. ```bash
git clone https://github.com/AbdulSafiCS/muzmates.git
cd muzmates

```bash
git clone https://github.com/AbdulSafiCS/muzmates.git
cd muzmates

