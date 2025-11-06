import ListaSessaoPage from "./pages/ListaSessaoPage";
import SessaoPage from "./pages/SessaoPage";
import { ThemeProvider } from "../src/provider/ThemeProvider";

export default function Index() {
  return (
    <ThemeProvider>
      <ListaSessaoPage />
    </ThemeProvider>
    
  );
}
