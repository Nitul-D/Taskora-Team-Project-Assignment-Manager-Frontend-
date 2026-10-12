import Navbar from "./Navbar";
import { ScrollArea } from "./ui/scroll-area";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className=" rounded-xl h-full overflow-hidden bg-linear-to-b from-zinc-900 to-black border border-zinc-800">
      {/* TOP NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <ScrollArea className="h-[calc(100vh-90px)]">
        <div className="p-6">{children}</div>
      </ScrollArea>
    </main>
  );
};

export default PageLayout;
