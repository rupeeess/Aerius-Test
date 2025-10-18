import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogIn, Loader2 } from "lucide-react";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = "/api/auth/clickup";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-md bg-primary/10 mb-4">
            <svg
              viewBox="0 0 24 24"
              className="w-10 h-10 text-primary"
              fill="currentColor"
            >
              <path d="M2 18.439l3.636-2.09v-2.743L2 11.517v2.742zm3.636-9.207L2 7.143v2.742l3.636 2.09zm14.728 4.896L16.728 12l3.636-2.128zm-7.273 4.243L9.455 16.243 12 14.686l2.545 1.557-1.454.852zM24 7.143l-3.636 2.09v2.742L24 14.065V7.143zm-11.455-.857L9.91 4.658 12 3.343l2.09 1.315-1.545.928zM2 20.571l3.636-2.09 1.455.852-3.636 2.09L2 20.571zm20.364-2.09L24 20.57l-1.455.852-3.636-2.09 1.455-.851zM9.091 22.286L12 20.571l2.909 1.715L12 24l-2.909-1.714zM12 0L9.091 1.714 12 3.429l2.909-1.715L12 0z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            ClickUp OAuth
          </h1>
          <p className="text-muted-foreground">
            Connect your ClickUp account to get started
          </p>
        </div>

        <Card className="border-border">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold">Sign in</CardTitle>
            <CardDescription>
              Authenticate with your ClickUp workspace to access your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full"
              size="lg"
              data-testid="button-login-clickup"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Continue with ClickUp
                </>
              )}
            </Button>
            
            <div className="text-xs text-center text-muted-foreground">
              By continuing, you'll be redirected to ClickUp to authorize this application
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Secure OAuth 2.0 authentication</p>
        </div>
      </div>
    </div>
  );
}
