import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'product/:id',
    renderMode: RenderMode.Client  // Client-side rendering pour les routes dynamiques
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender // Prerendering pour les routes statiques
  }
];
