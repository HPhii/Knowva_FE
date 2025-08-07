# Copilot Customization Guide – Knowva (Detailed)

## Introduction

This document provides a comprehensive set of rules for GitHub Copilot to ensure all suggested or completed code strictly adheres to the standards of the **Knowva** project. Knowva is an intelligent learning platform that uses AI to generate study materials. Please follow these guidelines meticulously.

-----

## 1\. Tech Stack

All code must be compatible with our established project technologies:

* **Framework & Bundler**:
    * React ^19.1.0
    * Vite (for development server and bundling)
* **UI Components**:
    * Ant Design ^5
    * Headless UI
    * Heroicons
* **State Management**:
    * Redux Toolkit + React-Redux (for global state)
    * React Hooks (`useState`, `useReducer`, custom hooks) for local state
* **Routing**:
    * React Router DOM
* **Styling**:
    * Tailwind CSS (with our custom configuration)
    * CSS variables for the color palette
* **HTTP Client**:
    * Axios (using the pre-configured instance)
* **Linting & Quality Assurance**:
    * ESLint (using the project's specific configuration)

-----

## 2\. Design System

All generated components and styles must conform to our design system.

### 2.1. Color Palette

**Rule**: **Absolutely NO hard-coded hex color values**. Always use the defined CSS variables or corresponding Tailwind utility classes.

**Defined Color Variables:**

```css
/* src/index.css */
@theme {
  /* Font */
  --font-display: "Manrope", sans-serif;
  --color-background: #ffffff;

  /* Blue */
  --color-blue: #1f94e0;
  --color-blue-hover: #007fd2;

  /* Yellow */
  --color-yellow: #ffcc00;
  --color-yellow-hover: #e9bb00;

  /* Red */
  --color-red-text: #e01f1f;
  --color-red-price-board: #ba0000;
  --color-red-price-board-button: #ffaeae;
  --color-red-price-board-button-hover: #ff8181;

  /* Green */
  --color-green-price-board: #008a20;
  --color-green-price-board-button: #c1e3cd;
  --color-green-price-board-button-hover: #b5d9b5;

  /* Grey */
  --color-grey-light: #f0f2f5;
  --color-grey-dark: #dbe0e5;
}
```

**Usage:**

* **In JSX (with Tailwind):** Use the utility classes that have been configured with these colors.
  ```jsx
  // GOOD
  <button className="bg-blue text-white hover:bg-blue-hover">
    Click Me
  </button>

  // BAD
  <button style={{ backgroundColor: '#1f94e0' }}>
    Don't do this
  </button>
  ```
* **In CSS files:** Use the `var()` function to reference variables.
  ```css
  .custom-component {
    border-color: var(--color-grey-dark);
  }
  ```

### 2.2. Minimalist Design

* **Prioritize Whitespace**: Use Tailwind's spacing utilities (`p-`, `m-`, `gap-`) with a 4px scale (e.g., `p-4`, `gap-6`, `m-8`) to create a clean and uncluttered layout.
* **Simple Layout**: Only display essential elements for the current context. Use lazy loading or conditional rendering to avoid overwhelming the user.
* **Focus on Core Elements**: Eliminate unnecessary decorative details (extra borders, complex gradients).
* **Subtle Corners and Shadows**: Use `rounded-lg` (8px) or `rounded-xl` (12px). Use `shadow-sm` or `shadow-md` for subtle depth, and avoid heavy shadows like `shadow-2xl`.

-----

## 3\. Coding Standards

### 3.1. Directory & File Structure

Always adhere to the established directory structure for consistency.

```
src/
├── assets/          # Static assets (images, fonts)
│   └── images/
│       └── logo_no_text.png
├── components/      # Reusable UI components (Button, Card, Modal)
│   ├── Footer.jsx
│   └── Header.jsx
├── config/          # Configuration files
│   └── axios.js     # Axios instance configuration
├── hooks/           # Custom React hooks
├── pages/           # Page-level components
│   └── Home/
│       └── Home.jsx
├── router/          # React Router configuration
│   └── router.jsx
├── store/           # Redux: store, slices, and APIs
├── styles/          # Deprecated, use src/index.css
├── App.jsx          # Root layout component
└── main.jsx         # Application entry point
```

### 3.2. Naming Conventions

* **Components & Pages**: `PascalCase` (e.g., `Header.jsx`, `DocumentCard.jsx`).
* **Custom Hooks**: `use` + `PascalCase` (e.g., `useAuth.js`).
* **Other files (utils, config)**: `camelCase` (e.g., `axios.js`).

### 3.3. Clean Code

* **Functional Components & Hooks**: This is a mandatory standard. Do not use Class Components.
* **Separate Logic from UI**: Extract business logic from JSX into custom hooks.
  ```jsx
  // Before: Logic is mixed inside the component
  const UserProfile = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setLoading(true);
      api.get(`/users/${userId}`).then(res => {
        setUser(res.data);
        setLoading(false);
      });
    }, [userId]);

    if (loading) return <Spinner />;
    return <div>{user.name}</div>;
  }

  // After: Logic is separated into a hook
  // hooks/useUser.js
  const useUser = (userId) => {
    // ... same logic as above ...
    return { user, loading };
  }

  // components/UserProfile.jsx
  const UserProfile = ({ userId }) => {
    const { user, loading } = useUser(userId);
    if (loading) return <Spinner />;
    return <div>{user.name}</div>;
  }
  ```
* **Don't Repeat Yourself (DRY)**: Abstract repetitive UI patterns into shared components. For instance, instead of styling buttons everywhere, create a `<Button />` component.

-----

## 4\. Specific Implementation Patterns

### 4.1. Routing

* The application uses a root layout in `App.jsx` which includes the `Header` and `Footer`.
* Page content is rendered via the `<Outlet />` component within this layout.
* All routes are centrally defined in `src/router/router.jsx`. To add a new page, declare it within the `children` array of the root route.

### 4.2. API Interaction

* Always import and use the pre-configured Axios instance from `src/config/axios.js`.
* This instance automatically attaches the `Authorization` header to every request by retrieving the token from `localStorage`. You do not need to do this manually.
  ```jsx
  import api from '../config/axios';

  const fetchDocuments = async () => {
    try {
      // The interceptor will add the token automatically
      const response = await api.get('/documents');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      // Handle error
    }
  };
  ```

### 4.3. Responsive & Mobile-First

Always design for mobile screens first, then scale up for larger screens using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`).

**Example**: A two-column layout on desktop that stacks on mobile.

```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Main content: takes up 2/3 width on desktop */}
  <main className="md:col-span-2">
    {/* ... */}
  </main>
  
  {/* Sidebar: takes up 1/3 width on desktop, stacks on mobile */}
  <aside className="md:col-span-1">
    {/* ... */}
  </aside>
</div>
```
---

### 5. Internationalization (i18n) – Required for All UI

All user-facing text must support internationalization using `react-i18next`. **Never hardcode any string** in JSX or component logic.

#### 5.1. Text Handling

* Always use the `useTranslation` hook:

  ```js
  import { useTranslation } from "react-i18next";

  const { t } = useTranslation();
  <button>{t("login.loginButton")}</button>;
  ```
* Do not hardcode English, Vietnamese, or any language directly in JSX.

#### 5.2. Localization Files

* Add all new translation keys and values to both:

    * `src/locales/en/translation.json`
    * `src/locales/vi/translation.json`

* Keep translation keys semantic and consistent. For example:

  ```json
  // en.json
  {
    "login": {
      "googleButton": "Continue with Google"
    }
  }

  // vi.json
  {
    "login": {
      "googleButton": "Đăng nhập bằng Google"
    }
  }
  ```

#### 5.3. UI Modification Rules

Whenever adding or modifying any of the following:

* A **new button**, **label**, **form field**, or **helper text**
* A **page**, **component**, or **modal**

You must:

1. Wrap all new visible text with `t("...")`.
2. Update `en.json` and `vi.json` accordingly.
3. Ensure UI is language switchable using the current `i18n.changeLanguage(...)` mechanism.

#### 5.4. Example: Google Login Button

When replicating the "Login with Google" button from the Login page into the Sign Up page:

* Reuse the same `<GoogleLogin />` setup.
* Wrap any new helper or instruction text in `t(...)`.
* Add translations:

  ```json
  // en.json
  "signup": {
    "googleButton": "Sign up with Google"
  }

  // vi.json
  "signup": {
    "googleButton": "Đăng ký bằng Google"
  }
  ```

---

### ✅ Summary

> When building or editing UI components:
>
> * ❌ Never hardcode strings
> * ✅ Always use `t(...)`
> * ✅ Update both `en.json` and `vi.json`
> * ✅ Maintain semantic key naming under the correct section (`login`, `signup`, `profile`, etc.)

-----

When you generate any code, file, or snippet, please apply all the above criteria. This will ensure your suggestions seamlessly match the standards, UI, and user experience of **Knowva**.