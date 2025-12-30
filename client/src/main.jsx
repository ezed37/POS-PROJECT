import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthProvider from "./auth/AuthProvider";
import { ThemeProviderCustom } from "./theme/ThemeContext";

function Root() {
  return (
    <ThemeProviderCustom>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProviderCustom>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
