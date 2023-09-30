"use client";

import Header from "./components/header";
import { SidebarProvider } from "./context/SidebarContext";
import HomePage from './components/HomePage';

export default function Index(): JSX.Element {
  return (
    <SidebarProvider>
      <Header />
      <div className="flex dark:bg-gray-900">
        <main className="order-2 mx-4 mt-4 mb-24 flex-[1_0_16rem]">
          <HomePage />
        </main>
      </div>
    </SidebarProvider>
  );
}
