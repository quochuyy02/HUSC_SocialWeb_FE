import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginUI/Login";
import ForgetPassword from "./pages/LoginUI/ForgetPassword";
import ResetPassword from "./pages/LoginUI/ResetPassword";
import HomePage from "./pages/HomePage";
import "./reset.css";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";
import ProfileDetail from "./pages/ProfileDetail";
import Message from "./pages/Message";
import SetInitialPassword from "./pages/LoginUI/SetInitialPassword";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./AuthProvider";
import ChangePassword from "./pages/ChangePassword";
import { UserProvider } from "./UserProvider";
import SearchResult from "./pages/SearchResult";
import Users from "./pages/Users";
import SavedPost from "./pages/SavedPost";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <Routes>
            <Route path="/home" element={<HomePage />}>
              <Route path="profile/:userId" element={<Profile />} />
              <Route path="profiledetail" element={<ProfileDetail />} />
              <Route path="post/:postId" element={<PostDetail />} />
              <Route path="search" element={<SearchResult />} />
              <Route path="users" element={<Users />} />
              <Route path="savedposts" element={<SavedPost />} />
            </Route>
            <Route path="/" element={<Login />} />
            <Route path="/messages" element={<Message />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />
            <Route path="/setpassword" element={<SetInitialPassword />} />
            <Route path="/changepassword" element={<ChangePassword />} />

            {/* <Route path="/post/:id" element={<PostDetail />} /> */}
            <Route path="*" element={<h1> Page not found, 404! </h1>} />
          </Routes>
        </UserProvider>
      </AuthProvider>

      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
