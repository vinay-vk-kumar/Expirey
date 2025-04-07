import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { SignUp } from './pages/SignUp'
import { SignIn } from './pages/SignIn';

import { DatesProvider } from '@mantine/dates';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

import RedirectUser from './Components/RedirectUser';
import NotFound from './pages/NotFound';

export default function App() {
  return <MantineProvider  withGlobalStyles
  withNormalizeCSS defaultColorScheme='dark'>

                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<RedirectUser />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>

    </MantineProvider>;
}