"use client";
import React,{useEffect} from "react";
import { Toaster } from "@/components/ui/sonner"
import Header from "./_components/Header";
import logo from "../../public/logo.svg";
import { createContext, useState } from "react";
export const WebCamContext = createContext();

const DashboardLayout = ({ children }) => {
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  return (
    <div>
      <Toaster/>
        <Header logo={logo} />
        <div className='mx-5 md:mx-20 lg:mx-36'>
          <WebCamContext.Provider value={{ webCamEnabled, setWebCamEnabled }}>
            {children}
          </WebCamContext.Provider>
        </div>
    </div>
  );
};

export default DashboardLayout;
