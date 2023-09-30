import { Card, Button } from "flowbite-react";

export default function Index(): JSX.Element {
  return (
    <div className="p-6">
      <section>
        <header>
          <h1 className="mb-6 text-center text-5xl font-extrabold dark:text-white">
            Welcome to <code>TestProject</code> for <code>Chromaway</code>!
          </h1>
        </header>
        <main className="flex justify-center">
          <Card className="w-1/2">
            <p className="text-center font-bold text-lg dark:text-white">Send Cryptocurrencies</p>
            <div className="border-2 h-[2px]"></div>
            <Button className="bg-primary hover:opacity-80 hover:bg-primary">Connect Wallet</Button>
          </Card>
        </main>
      </section>
    </div>
  );
}
