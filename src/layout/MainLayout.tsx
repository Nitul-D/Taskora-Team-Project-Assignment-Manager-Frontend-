import {ResizableHandle,ResizablePanel,ResizablePanelGroup} from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import { useEffect, useState } from "react";
import RightSidebar from "./components/RightSidebar";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  //for the mobile useEffect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup
        orientation="horizontal"
        className="flex-1 flex h-full overflow-hidden p-2 "
      >

        {/*for the left side of the page */}
        {!isMobile && (
          <>
            <ResizablePanel defaultSize="20%" minSize="20%" maxSize="20%">
              <LeftSidebar />
            </ResizablePanel>

            <ResizableHandle className="w-2 bg-black rounded-md transition-colors hidden md:flex" />
          </>
        )}

        {/*Main content middle */}
        <ResizablePanel defaultSize="60%">
          <Outlet />
        </ResizablePanel>

        {!isMobile && (
          <>
            <ResizableHandle
              withHandle
              className="hidden md:flex w-2 bg-black items-center rounded-md justify-center"
            />

            {/*for the right side of the page */}
            <ResizablePanel defaultSize="20%" minSize="0%" maxSize="20%" collapsible collapsedSize="0%" >
              <RightSidebar />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

    </div>
  );
};

export default MainLayout;
