import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Login from "@/pages/login";
import Profile from "@/pages/profile";
import Callback from "@/pages/callback";
import NotFound from "@/pages/not-found";
import type { User } from "@shared/schema";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }): JSX.Element {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/user/profile"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

function PublicRoute({ component: Component }: { component: () => JSX.Element }): JSX.Element {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/user/profile"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Redirect to="/profile" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        {() => <PublicRoute component={Login} />}
      </Route>
      <Route path="/callback" component={Callback} />
      <Route path="/profile">
        {() => <ProtectedRoute component={Profile} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
