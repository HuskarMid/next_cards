'use client'

import "./globals.css";
import MyHeader from "./components/myHeader";
import MyFooter from "./components/myFooter";
import { Provider } from "react-redux";
import { store } from "./store/store";

// Для работы с styled-components в next
import StyledComponentsRegistry from './registry'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MyHeader />
        <main className="container">
          <Provider store={store}>
            <StyledComponentsRegistry>
              {children}
            </StyledComponentsRegistry>
          </Provider>
        </main>
        <MyFooter  />

      </body>
    </html>
  );
}
