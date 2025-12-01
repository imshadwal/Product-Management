# Frontend ↔ Backend Flow

This document describes how the frontend and backend interact in this project and the main files involved. You can open this file at `product-management-backend/ARCHITECTURE.md` to copy or keep in your notes.

**Backend**
- **Framework & entry:** `product-management-backend` is a NestJS app. The application boots at `src/main.ts`.
- **Module wiring:** `src/app.module.ts` wires modules including the `Products` module and `Prisma` module. Controllers and services are provided through Nest's DI.
- **Controller layer:** `src/products/products.controller.ts` receives HTTP requests (GET/POST/PUT/DELETE), parses params and body, then calls service methods.
- **Service layer:** `src/products/products.service.ts` implements business logic:
  - `create(data)` -> creates product via Prisma.
  - `findAll(page, limit, search)` -> builds a `where` filter (search by `name` insensitive) and concurrently calls `findMany` (with `skip`, `take`, `orderBy`) and `count` to return `{ data, total }`.
  - `findOne(id)` -> `findUnique`, throws `NotFoundException` if missing.
  - `update(id, data)` -> ensures existence then `update`.
  - `remove(id)` -> ensures existence then `delete`.
  - `seedProducts()` -> helper to insert mock data.
- **Database access:** `src/prisma/prisma.service.ts` provides a Prisma client injected into services. `prisma/schema.prisma` defines the `Product` model.
- **Error handling & validation:** Controllers/services use Nest exceptions (e.g., `NotFoundException`) and may rely on Nest validation pipes for request DTOs.
- **Response shape:** List endpoint returns `{ data: Product[], total: number }` to support frontend pagination.

**Frontend**
- **App & pages:** `product-management-frontend` is a React (Vite + TypeScript) app. Pages include `pages/Home.tsx`, `pages/ProductList.tsx`, and `pages/ProductForm.tsx`.
- **State & context:** `context/ProductContext.tsx` centralizes product-related state (list, pagination, search) and exposes actions.
- **Custom hooks:** `hooks/useProducts.ts` encapsulates fetching logic and provides page/limit/search state and actions to load or refetch.
- **Services / API wrappers:** `services/productService.ts` and/or `src/api/product.ts` wrap HTTP calls to backend endpoints and return parsed JSON.
- **UI components:**
  - `ProductList.tsx` lists products and uses `useProducts`/context.
  - `ProductCard.tsx` shows product details and exposes edit/delete events.
  - `ProductForm.tsx` handles create/update of a product and submits via service.
  - `SearchBar.tsx` updates search term and triggers refetch.
  - `Pagination.tsx` changes page and triggers refetch.

**End-to-end request sequence (typical)**
1. User performs an action in the UI (search, change page, create, update, delete).
2. Frontend composes an API request (e.g., `GET /products?page=2&limit=10&search=mouse`) using `productService`.
3. Nest controller (`src/products/products.controller.ts`) receives the request and calls `ProductService.findAll` / other service methods.
4. `ProductService` accesses the DB via `PrismaService`:
   - `findMany({ where, skip, take, orderBy })` to retrieve rows.
   - `count({ where })` to get the total count for pagination.
5. Controller returns JSON (e.g., `{ data: [...], total: 42 }`).
6. Frontend updates context/hook state and UI re-renders showing products + pagination.

**API Endpoints (inferred)**
- `GET /products` -> list with query params `page`, `limit`, `search`
- `GET /products/:id` -> fetch single product
- `POST /products` -> create product (body: product fields)
- `PUT /products/:id` -> update product
- `DELETE /products/:id` -> delete product

**Important files (map)**
- Backend:
  - `src/main.ts` — app bootstrap
  - `src/app.module.ts` — module config
  - `src/products/products.controller.ts` — routes
  - `src/products/products.service.ts` — business logic
  - `src/prisma/prisma.service.ts` — Prisma client provider
  - `prisma/schema.prisma` — DB models
- Frontend:
  - `pages/ProductList.tsx`, `pages/ProductForm.tsx`
  - `components/ProductCard.tsx`, `components/Pagination.tsx`, `components/SearchBar.tsx`
  - `context/ProductContext.tsx` — app state
  - `hooks/useProducts.ts` — data fetching logic
  - `services/productService.ts` / `src/api/product.ts` — HTTP wrappers

**Run locally (typical commands)**

Backend (from `product-management-backend`):

```
npm install
npx prisma generate
npx prisma migrate deploy   # or `npx prisma db push` for dev
npm run start:dev           # or `npm run start`
```

Frontend (from `product-management-frontend`):

```
npm install
npm run dev
```

**Notes & suggestions**
- The backend `findAll` returns both `data` and `total` — this is useful for pagination on the frontend.
- `seedProducts()` in `src/products/products.service.ts` inserts 20 mock products; run it carefully (it will create rows).
- Ensure CORS is enabled in Nest if frontend and backend run on different origins; check `src/main.ts` for `app.enableCors()`.
- Add DTOs and `class-validator` rules on the backend for stricter contracts.
- Use an env var like `VITE_API_URL` on the frontend to set the backend base URL.

---

If you'd like, I can also:
- Create a front-end example `productService` call that exactly matches query params and response typing.
- Add DTOs or update controller method signatures to show exact API contracts.

