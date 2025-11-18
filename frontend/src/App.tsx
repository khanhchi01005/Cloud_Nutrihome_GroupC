import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import FloatingTimer from "./components/FloatingTimer";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider, AuthContext } from "./AuthContext";
import { useContext } from "react";

function Layout() {
  const { user } = useContext(AuthContext);

  // // Nếu chưa login, chỉ render routes (ví dụ trang login/signup)
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          <AppRoutes />
        </div>
      </div>
    );
  }

  // Nếu đã login, hiện đủ Header, AppRoutes, FloatingChatButton, Footer
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <AppRoutes />
      </main>
      <FloatingTimer />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
