# Project brief: Booking app

## Overview

A mobile booking app for general public users. Users can browse bookable items (e.g. appointments, tables, or sessions), pick a slot, and confirm. The app uses an API for availability and bookings, requires login to book, and uses tabs for main navigation. Key choices: authentication (login/signup), API-backed availability and bookings, local persistence for auth token and preferences, tab-based navigation with optional stack for booking flow.

## Phase 1: Foundation (High)

- [ ] Set up Expo Router and base layout
- [ ] Set up Zustand and base store
- [ ] Configure NativeWind and theme
- [ ] Set up API client and env (lib/env.ts, .env.example)

## Phase 2: Authentication (High)

- [ ] Auth store (useAuthStore) with token and user, persist with AsyncStorage
- [ ] Login and signup screens in app/(auth)/
- [ ] API endpoints for login and signup (lib/api/endpoints/auth.ts)
- [ ] Protected route guard: redirect to login if not authenticated
- [ ] Redirect to home after login; wire token into API client

## Phase 3: Core booking flow (High)

- [ ] API endpoints for availability and create-booking (lib/api/endpoints/bookings.ts)
- [ ] Types for Slot, Booking, Resource (lib/api/types or per-endpoint)
- [ ] Home or “Browse” screen: list of bookable resources or categories
- [ ] Resource/detail screen: show available slots (date + time)
- [ ] Booking confirmation screen: summary and confirm action
- [ ] Success state and navigation back after booking

## Phase 4: My bookings & profile (Medium)

- [ ] API endpoint to fetch user’s bookings (e.g. getMyBookings)
- [ ] “My bookings” screen: list of upcoming and past bookings
- [ ] Profile or account screen (view user info, optional edit)

## Phase 5: Polish (Medium)

- [ ] Settings screen (theme, notifications, logout)
- [ ] Error and loading states (skeletons, error boundaries, retry)
- [ ] Empty states (no bookings yet, no slots available)
- [ ] Basic tests for auth flow and booking creation
