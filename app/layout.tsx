'use client'
import { Montserrat } from 'next/font/google'
import "./globals.css";
import MyHeader from "./components/myHeader";
import MyFooter from "./components/myFooter";
import { Provider } from "react-redux";
import { store } from "./store/store";

// Для работы с styled-components в next
import StyledComponentsRegistry from './registry'

// Шрифт для всего приложения
const montserrat = Montserrat({
  weight: ['400', '700'],  // укажите нужные вам начертания
  subsets: ['latin', 'cyrillic'],  // укажите нужные подмножества символов
  display: 'swap',
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <MyHeader />
        <main className="container">
          <Provider store={store}>
            <StyledComponentsRegistry>
              {children}
            </StyledComponentsRegistry>
          </Provider>
        </main>

      </body>
    </html>
  );
}
