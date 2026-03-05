---
name: expo-error-handling
description: Adds error boundaries, loading states, retry logic, and user-facing error display for Expo apps. Use when adding error handling, loading indicators, empty states, or toast/alert feedback in an Expo + NativeWind app.
---

# Expo error handling

Creates and edits **error handling and loading patterns** in the generated app: error boundaries, loading skeletons/spinners, empty states, retry logic, and user-facing error feedback. Follow **expo-app-conventions** for paths and **expo-ui-agent** for styling (NativeWind only).

## When to use

- Add error boundaries to catch render crashes.
- Add loading indicators (spinner, skeleton) for async data.
- Add empty state UI ("No items yet").
- Add retry logic for failed API calls.
- Add toast or alert feedback for action results (success/failure).

## Placement

| Item | Location | Example |
|------|----------|---------|
| Error boundary component | `components/ui/ErrorBoundary.tsx` | Wraps screens or feature sections |
| Loading spinner/skeleton | `components/ui/Loading.tsx` | Reusable across screens |
| Empty state | `components/ui/EmptyState.tsx` | Icon + message + optional action |
| Toast/alert utility | `lib/utils/toast.ts` or a small component | Lightweight feedback |
| Hook-level error/loading | `hooks/` | Data hooks expose `{ data, isLoading, error }` |

## Error boundary pattern

```tsx
// components/ui/ErrorBoundary.tsx
import { Component, type ReactNode } from "react";
import { View, Text, Pressable } from "react-native";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean; error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-lg font-semibold text-red-600 mb-2">Something went wrong</Text>
          <Text className="text-sm text-gray-500 mb-4 text-center">{this.state.error?.message}</Text>
          <Pressable onPress={this.reset} className="bg-primary rounded-lg px-4 py-2">
            <Text className="text-white font-medium">Try again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
```

## Loading pattern

```tsx
// components/ui/Loading.tsx
import { View, ActivityIndicator, Text } from "react-native";

type LoadingProps = { message?: string };

export function Loading({ message }: LoadingProps) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <ActivityIndicator size="large" className="mb-3" />
      {message && <Text className="text-sm text-gray-500">{message}</Text>}
    </View>
  );
}
```

## Empty state pattern

```tsx
// components/ui/EmptyState.tsx
import { View, Text, Pressable } from "react-native";

type EmptyStateProps = {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-lg font-semibold text-gray-700 mb-1">{title}</Text>
      {message && <Text className="text-sm text-gray-500 mb-4 text-center">{message}</Text>}
      {actionLabel && onAction && (
        <Pressable onPress={onAction} className="bg-primary rounded-lg px-4 py-2">
          <Text className="text-white font-medium">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
```

## Hook error/loading pattern

Data-fetching hooks (see **expo-api-agent**) should expose loading, error, and retry:

```ts
// hooks/useUser.ts
import { useState, useEffect, useCallback } from "react";
import { getMe } from "@/lib/api/endpoints/users";
import type { User } from "@/lib/api/types";

export function useUser() {
  const [data, setData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await getMe());
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
```

## Screen composition

Screens combine these primitives:

```tsx
// app/(tabs)/profile.tsx
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProfileCard } from "@/components/features/ProfileCard";
import { useUser } from "@/hooks/useUser";
import { Screen } from "@/components/layout/Screen";

export default function ProfileScreen() {
  const { data, isLoading, error, refetch } = useUser();

  return (
    <Screen title="Profile">
      <ErrorBoundary>
        {isLoading && <Loading message="Loading profile..." />}
        {error && <EmptyState title="Failed to load" message={error.message} actionLabel="Retry" onAction={refetch} />}
        {data && <ProfileCard user={data} />}
      </ErrorBoundary>
    </Screen>
  );
}
```

## Rules

1. **Always handle three states** in screens that fetch data: loading, error, and success (with empty as a sub-case of success).
2. **Error boundaries** at layout or screen level to catch unexpected render crashes; don't let the whole app white-screen.
3. **NativeWind only**: style error/loading/empty UI with `className`. No `StyleSheet`.
4. **Hooks expose `{ data, isLoading, error, refetch }`**: screens should never need to `try/catch` API calls directly.
5. **Coordinate**: use **expo-api-agent** for the data hooks, **expo-ui-agent** for the UI components, **expo-forms-agent** for form-specific error display.
