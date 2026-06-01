import { Switch, Route, Router as WouterRouter } from "wouter";
import { Reader } from "@/pages/Reader";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground font-sans">Page not found</p>
      </div>
    </div>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Reader} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <AppRouter />
    </WouterRouter>
  );
}

export default App;
