import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Category from "./pages/Category.jsx";
import Listing from "./pages/Listing.jsx";
import Auth from "./pages/Auth.jsx";
import PostAd from "./pages/PostAd.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category" element={<Category />} />
      <Route path="/listing" element={<Listing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/post-ad" element={<PostAd />} />
    </Routes>
  );
}
