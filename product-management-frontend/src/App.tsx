import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductList from "../pages/ProductList";
import ProductForm from "../pages/ProductForm";
import type { Product } from "../components/product";

function App() {
  // Dummy handlers for now
  const handlePageChange = (newPage: number) => {
    console.log("Change to page:", newPage);
  };

  const handleSaveProduct = (data: { name: string; price: number; description?: string }) => {
    console.log("Saving product:", data);
  };

  const dummyProducts: Product[] = []; // empty array for initial build

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/products"
            element={
              <ProductList
                products={dummyProducts}
                total={0}
                page={1}
                pageSize={9}
                onPageChange={handlePageChange}
              />
            }
          />

          <Route
            path="/products/new"
            element={<ProductForm onSave={handleSaveProduct} />}
          />

          <Route
            path="/products/:id/edit"
            element={<ProductForm onSave={handleSaveProduct} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
