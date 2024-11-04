import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProductProvider } from './contexts/ProductContext';
import './App.css';

// layout
import Layout from './component/layout';
import Productcard from './component/Productcard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

// pages
import Home from "./pages/home"; 
import Shop from "./pages/shop"; 
import { Register } from './pages/Register';
import Login from './pages/Login';
import Contact from './pages/Contact';
import DetailBook from './pages/detailbook';
import AdminGetInformation from './pages/Admingetinformation';
import Support from './pages/Support';
import About from './pages/Aboutus';
// Component
import Checkout from './component/Checkout';
import Cart from './component/Cart';
import Orders from './pages/Orders';
import ProductList from './pages/ProductList';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} /> 
                <Route path="/shop" element={<Shop />} /> 
                <Route path="/register" element={<Register/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/productcard" element={<Productcard />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/About" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/book/:id" element={<DetailBook />} /> 
                <Route path="/AdminGetInformation" element={<AdminGetInformation/>} />
                <Route path="/support" element={<Support />} />
                <Route path="/Productlist" element={<ProductList/>} />
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
