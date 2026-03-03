# Create Basic Expo App

Script to generate a new Expo app with TypeScript, NativeWind, optional navigation and state management, ESLint, Prettier, env vars, and folder structure.

## Create a new project

```bash
./create-expo-app.sh
```

Follow the prompts (project name, navigation, state management). The script creates the project folder and configures everything.

---

## Next steps (after opening the project)

### 1. Run the app with Expo

From the **project root** (the folder the script created):

```bash
# Install dependencies (if you just cloned or moved the project)
npm install

# Start the Expo dev server
npx expo start
```

**On a real device**

- Install **Expo Go** from the App Store or Play Store.
- In the terminal, press `w` to open the web UI, then scan the QR code with Expo Go.
- If the QR code doesn’t work on your network, run: `npx expo start --tunnel`.

**On a simulator/emulator**

- **Android**: Start the Android Studio emulator, then in the Expo terminal press `a`.
- **iOS** (macOS only): In the Expo terminal press `i`.

---

### 2. Lint and format (optional)

```bash
npm run lint
npm run format
```

---

### 3. Build for production (APK/IPA) with EAS

To create installable builds (Android/iOS):

```bash
npm install -g eas-cli
eas login
eas build:configure
```

Then:

- **Android**: `eas build --platform android`
- **iOS** (requires macOS + Apple dev account): `eas build --platform ios`

Expo will provide a link to download the build when it’s ready.

---

## Quick reference

| Action              | Command                    |
|---------------------|----------------------------|
| Create new app      | `./create-expo-app.sh`     |
| Start dev server    | `npx expo start`           |
| Start with tunnel   | `npx expo start --tunnel`  |
| Lint                | `npm run lint`             |
| Format              | `npm run format`           |
| Build Android       | `eas build --platform android` |
| Build iOS           | `eas build --platform ios` |
