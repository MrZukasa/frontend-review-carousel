import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import CMSPage from "./pages/CMSPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./contexts/AuthProvider";

const App: React.FC = (): React.ReactElement => {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <CMSPage />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
