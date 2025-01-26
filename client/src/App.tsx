import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Game from "@/pages/game";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin";
import ZonesManagement from "@/pages/admin/zones";
import ObjectsManagement from "@/pages/admin/objects";
import ScenariosManagement from "@/pages/admin/scenarios";
import ReleaseNotes from "@/pages/admin/release-notes";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Game} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/zones" component={ZonesManagement} />
      <Route path="/admin/objects" component={ObjectsManagement} />
      <Route path="/admin/scenarios" component={ScenariosManagement} />
      <Route path="/admin/release-notes" component={ReleaseNotes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </DndProvider>
  );
}

export default App;