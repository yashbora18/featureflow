import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Shell } from '@/components/layout/shell';

// Pages
import DashboardPage from '@/pages/dashboard';
import FlagsPage from '@/pages/flags';
import FlagDetailsPage from '@/pages/flag-details';
import EnvironmentsPage from '@/pages/environments';
import AuditLogsPage from '@/pages/audit-logs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/flags" component={FlagsPage} />
        <Route path="/flags/:id" component={FlagDetailsPage} />
        <Route path="/environments" component={EnvironmentsPage} />
        <Route path="/audit-logs" component={AuditLogsPage} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
