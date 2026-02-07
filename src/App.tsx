import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Login from "./pages/LoginPage";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/User/DashBoardPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AppLayout role="ADMIN" />
              </ProtectedRoute>
            }
          >
            <Route path="horses" element={<>horses</>} />
            <Route path="feeders" element={<h2>feeders</h2>} />
            <Route path="users" element={<>users</>} />
          </Route>

          {/* User Routes */}
          <Route
            path="/user"
            element={
              <ProtectedRoute role="USER">
                <AppLayout role="USER" />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="feeders" element={<>feeders</>} />
          </Route>

          {/*  */}
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      <Toaster
        position="bottom-right"
        gutter={16}
        containerStyle={{ margin: "12px" }}
        toastOptions={{
          // ✅ SUCCESS: Light bg + Green text + Green icon
          success: {
            duration: 4000,
            style: {
              fontSize: "15px",
              maxWidth: "420px",
              padding: "14px 22px",
              backgroundColor: "#f0fdf4", // Light green bg
              color: "#166534", // Dark green text
              border: "1px solid #bbf7d0", // Light green border
              borderRadius: "12px",
            },
            iconTheme: {
              primary: "#15803d", // Green checkmark
              secondary: "#f0fdf4", // Light green bg
            },
          },
          // ✅ ERROR: Dark green bg + White text (inverted for contrast)
          error: {
            duration: 6000,
            style: {
              fontSize: "15px",
              maxWidth: "420px",
              padding: "14px 22px",
              backgroundColor: "#166534", // Dark green bg
              color: "#f0fdf4", // Light green text
              border: "1px solid #15803d", // Green border
              borderRadius: "12px",
            },
            iconTheme: {
              primary: "#f0fdf4", // White X icon
              secondary: "#166534", // Dark green bg
            },
          },
          // Base styles
          style: {
            fontFamily: "'Roboto', sans-serif",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(22, 101, 52, 0.15)", // Green shadow
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
