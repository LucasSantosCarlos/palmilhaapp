import SessaoPage from "./pages/SessaoPage";
import { ThemeProvider } from "./provider/ThemeProvider";

export default function Index() {
  return (
    <ThemeProvider>
      <SessaoPage />
    </ThemeProvider>
    
  );
}
