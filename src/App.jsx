import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Category from "./pages/Category.jsx";
import Listing from "./pages/Listing.jsx";
import Auth from "./pages/Auth.jsx";
import PostAd from "./pages/PostAd.jsx";
import Messages from "./pages/Messages.jsx";
import MyListings from "./pages/MyListings.jsx";
import AdminReview from "./pages/AdminReview.jsx";
import Info from "./pages/Info.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category" element={<Category />} />
      <Route path="/listing/:id" element={<Listing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/post-ad" element={<PostAd />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/messages/:conversationId" element={<Messages />} />
      <Route path="/my-listings" element={<MyListings />} />
      <Route path="/admin" element={<AdminReview />} />
      <Route path="/info" element={<Info />} />
    </Routes>
  );
}
