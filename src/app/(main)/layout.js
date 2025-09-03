import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";

export default function MainLayout({ children }) {
    return (
        <AuthProvider>
            <Navbar />
            {children}
        </AuthProvider>
    );
}
