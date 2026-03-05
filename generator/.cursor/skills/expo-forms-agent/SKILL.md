---
name: expo-forms-agent
description: Adds forms with validation, reusable inputs, and error display for Expo apps. Use when adding forms, field validation (Zod), or reusable form patterns in an Expo + NativeWind app.
---

# Expo forms agent

Creates and edits **forms** in the generated app: form state, field validation (Zod), reusable input components, and inline error messages. Follow **expo-app-conventions** for paths and **expo-ui-agent** for styling (NativeWind only).

## When to use

- Add a form (login, signup, settings, profile edit, feedback, etc.).
- Add or change field validation (required, email, min length, etc.).
- Create reusable form inputs with error display.
- Wire form submission to an API endpoint or store action.

## Stack

| Concern | Choice | Notes |
|---------|--------|-------|
| Validation | Zod | Schema-based; `.parse()` or `.safeParse()` |
| Form state | React `useState` or a lightweight form hook | No heavy form libraries unless user requests one |
| Styling | NativeWind `className` | Error states via conditional classes |
| Inputs | `components/ui/` | Reusable `TextInput` wrapper with label + error |

## Placement

| Item | Location | Example |
|------|----------|---------|
| Zod schemas | `lib/validation/` or co-located with the form | `lib/validation/auth.ts`, or inline in the form component |
| Reusable input | `components/ui/FormField.tsx` | Label, TextInput, error text in one component |
| Feature forms | `components/features/` | `LoginForm.tsx`, `ProfileForm.tsx` |
| Form screens | `app/` | Thin: compose `<Screen>` + `<LoginForm />` |

## Validation pattern (Zod)

```ts
// lib/validation/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;
```

## Reusable input pattern

```tsx
// components/ui/FormField.tsx
import { View, Text, TextInput, type TextInputProps } from "react-native";

type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function FormField({ label, error, ...props }: FormFieldProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-foreground mb-1">{label}</Text>
      <TextInput
        className={`border rounded-lg px-3 py-2 text-base ${error ? "border-red-500" : "border-gray-300"}`}
        {...props}
      />
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
```

## Form component pattern

```tsx
// components/features/LoginForm.tsx
import { useState } from "react";
import { View } from "react-native";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

type FieldErrors = Partial<Record<keyof LoginValues, string>>;

export function LoginForm({ onSubmit }: { onSubmit: (values: LoginValues) => void }) {
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit() {
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof LoginValues;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onSubmit(result.data);
  }

  return (
    <View className="gap-2">
      <FormField
        label="Email"
        value={values.email}
        onChangeText={(email) => setValues((v) => ({ ...v, email }))}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormField
        label="Password"
        value={values.password}
        onChangeText={(password) => setValues((v) => ({ ...v, password }))}
        error={errors.password}
        secureTextEntry
      />
      <Button onPress={handleSubmit}>Log in</Button>
    </View>
  );
}
```

## Rules

1. **Zod for validation**: define schemas in `lib/validation/` or co-located; use `.safeParse()` for forms so you get structured errors.
2. **NativeWind only**: style error states with conditional `className` (e.g. `border-red-500`). No `StyleSheet`.
3. **Reusable inputs**: wrap `TextInput` in `components/ui/FormField.tsx` (or similar) with label + error. Don't repeat label/error markup in every form.
4. **No business logic in form components**: call `onSubmit(validatedData)` and let the parent or hook handle API calls and store updates.
5. **Coordinate**: use **expo-api-agent** for submission endpoints, **expo-state-agent** if form data updates a store, **expo-auth-flow** for login/signup forms specifically.
