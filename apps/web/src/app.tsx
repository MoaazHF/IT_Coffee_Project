import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout";
import { ErrorBoundary } from "./components/error-boundary";
import { HomePage } from "./pages/home-page";
import { ShopPage } from "./pages/shop-page";
import { ProductPage } from "./pages/product-page";
import { CartPage } from "./pages/cart-page";
import { CheckoutPage } from "./pages/checkout-page";
import { LoginPage } from "./pages/login-page";
import { SignupPage } from "./pages/signup-page";
import { ContactPage } from "./pages/contact-page";
import { ThankYouPage } from "./pages/thank-you-page";
import { NotFoundPage } from "./pages/not-found-page";
import { AuthProvider } from "./context/auth-context";
import { CartProvider } from "./context/cart-context";
import "./styles/tokens.css";
import "./styles/app.css";

export const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/products/:slug" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />

              <Route path="/index.html" element={<Navigate to="/" replace />} />
              <Route path="/shop.html" element={<Navigate to="/shop" replace />} />
              <Route path="/cart.html" element={<Navigate to="/cart" replace />} />
              <Route path="/checkout.html" element={<Navigate to="/checkout" replace />} />
              <Route path="/login.html" element={<Navigate to="/login" replace />} />
              <Route path="/signup.html" element={<Navigate to="/signup" replace />} />
              <Route path="/contact.html" element={<Navigate to="/contact" replace />} />
              <Route path="/thank-you.html" element={<Navigate to="/thank-you" replace />} />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
