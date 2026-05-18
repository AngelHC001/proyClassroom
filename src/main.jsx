import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './genUser-sections/AuthContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App.jsx'

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false}/>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </QueryClientProvider>
  </AuthProvider>

)
