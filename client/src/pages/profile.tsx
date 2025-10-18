import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Mail, Calendar, Briefcase, CheckCircle2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { User as UserType } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function Profile() {
  const { toast } = useToast();

  const { data: user, isLoading } = useQuery<UserType>({
    queryKey: ["/api/user/profile"],
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/";
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Please try again",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userData = user.userData as any;
  const userInitials = user.username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded bg-primary/10">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-primary"
                fill="currentColor"
              >
                <path d="M2 18.439l3.636-2.09v-2.743L2 11.517v2.742zm3.636-9.207L2 7.143v2.742l3.636 2.09zm14.728 4.896L16.728 12l3.636-2.128zm-7.273 4.243L9.455 16.243 12 14.686l2.545 1.557-1.454.852zM24 7.143l-3.636 2.09v2.742L24 14.065V7.143zm-11.455-.857L9.91 4.658 12 3.343l2.09 1.315-1.545.928zM2 20.571l3.636-2.09 1.455.852-3.636 2.09L2 20.571zm20.364-2.09L24 20.57l-1.455.852-3.636-2.09 1.455-.851zM9.091 22.286L12 20.571l2.909 1.715L12 24l-2.909-1.714zM12 0L9.091 1.714 12 3.429l2.909-1.715L12 0z"/>
              </svg>
            </div>
            <h1 className="text-lg font-semibold">ClickUp Profile</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-20 w-20 border-2 border-border">
              <AvatarImage src={user.profilePicture || undefined} alt={user.username} />
              <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold tracking-tight" data-testid="text-username">
                  {user.username}
                </h2>
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Connected
                </Badge>
              </div>
              {user.email && (
                <p className="text-muted-foreground" data-testid="text-email">
                  {user.email}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Connected {formatDistanceToNow(new Date(user.createdAt))} ago
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Username
                  </div>
                  <div className="text-sm font-normal" data-testid="text-account-username">
                    {user.username}
                  </div>
                </div>
                
                {user.email && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email
                    </div>
                    <div className="text-sm font-normal" data-testid="text-account-email">
                      {user.email}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    ClickUp ID
                  </div>
                  <div className="text-sm font-mono truncate" data-testid="text-clickup-id">
                    {user.clickupId}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Session Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    First Connected
                  </div>
                  <div className="text-sm font-normal">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Last Updated
                  </div>
                  <div className="text-sm font-normal">
                    {new Date(user.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    OAuth Status
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {userData && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">
                  Additional Profile Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {userData.color && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Profile Color
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border border-border"
                          style={{ backgroundColor: userData.color }}
                        />
                        <span className="text-sm font-mono">{userData.color}</span>
                      </div>
                    </div>
                  )}
                  
                  {userData.initials && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Initials
                      </div>
                      <div className="text-sm font-normal">{userData.initials}</div>
                    </div>
                  )}

                  {userData.week_start_day !== undefined && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Week Start Day
                      </div>
                      <div className="text-sm font-normal">
                        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
                          userData.week_start_day
                        ] || userData.week_start_day}
                      </div>
                    </div>
                  )}

                  {userData.timezone && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Timezone
                      </div>
                      <div className="text-sm font-normal">{userData.timezone}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
