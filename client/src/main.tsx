import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.tsx'
import { store } from './store'
import { queryClient } from './lib/react-query'
import { PageLoader } from './components/common/Loader'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<PageLoader message="Loading application..." />}>
          <App />
        </Suspense>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="!bg-white !text-gray-900 !shadow-lg !border !border-gray-200 !rounded-lg"
          progressClassName="!bg-green-600"
          closeButton={({ closeToast }) => (
            <button
              onClick={closeToast}
              className="text-gray-500! hover:text-gray-700! p-1!"
              aria-label="Close"
            >
              ×
            </button>
          )}
        />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
