# SUPER CENTAUR Performance Recommendations

## 1. Code Splitting & Lazy Loading

**Current State:** All components are imported eagerly in `App.jsx`.
**Impact:** Initial load time will increase as the application grows, downloading unused code.

**Recommendation:**
Use `React.lazy` and `Suspense` for route-based splitting.

```jsx
// Before
import MedicalHub from './components/MedicalHub';

// After
const MedicalHub = React.lazy(() => import('./components/MedicalHub'));

// Usage
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/medical" element={<MedicalHub />} />
  </Routes>
</Suspense>
```

## 2. API Optimization & Caching

**Current State:** Components like `LegalPortal` and `MedicalHub` fetch data on mount (`useEffect`) every time they are visited.
**Impact:** Unnecessary network requests, increased latency, and loading flickers when navigating between tabs.

**Recommendation:**
Implement a data fetching library like **TanStack Query (React Query)** or **SWR**.

```jsx
// Using React Query
import { useQuery } from '@tanstack/react-query';

const fetchMedicalDocs = async () => {
  const { data } = await axios.get('/api/medical/documents');
  return data;
};

const MedicalHub = () => {
  const { data, isLoading } = useQuery({ queryKey: ['medicalDocs'], queryFn: fetchMedicalDocs });

  if (isLoading) return <Spinner />;
  // ... render
};
```

## 3. Render Optimization

**Current State:** `TheObserverDashboard` re-renders every second due to a `setInterval` updating `lastUpdate`.
**Impact:** Minor CPU usage, but if complex logic is added to the render cycle, it could cause jank.

**Recommendation:**
- Isolate the clock into a separate `Clock` component so only that part re-renders, not the entire dashboard.
- Use `React.memo` for heavy components if needed.

## 4. Asset Optimization

**Current State:** Tailwind CSS is used, which is generally efficient as it purges unused styles. Icons are imported individually from `@heroicons/react`.
**Impact:** Good. Keep this pattern.

**Recommendation:**
- Ensure images (if added) are optimized (WebP format, responsive sizes).
- Use SVGs for icons (already doing this).

## 5. Bundle Analysis

**Recommendation:**
- Add `rollup-plugin-visualizer` to `vite.config.js` to analyze bundle size and identify large dependencies.

```javascript
// vite.config.js
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [react(), visualizer()],
  // ...
});
```
