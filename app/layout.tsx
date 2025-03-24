'use client'

import type { Metadata } from "next";
import "./globals.css";
import MyHeader from "./components/myHeader";
import MyFooter from "./components/myFooter";
import { Provider } from "react-redux";
import { store } from "./store/store";


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
            {children}
          </Provider>
        </main>
        <MyFooter  />

      </body>
    </html>
  );
}
