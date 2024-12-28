"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import StolenMoneyTracker from "./stolen-money";

const Footer: React.FC = () => {
  const [gasPrice, setGasPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchGasPrice = async () => {
      try {
        const response = await fetch("/api/tracker/gas");
        if (!response.ok) {
          throw new Error("Failed to fetch gas price");
        }
        const data = await response.json();
        setGasPrice(Number(data.result.ProposeGasPrice)); // Assuming the API returns this structure
      } catch (error) {
        console.error("Error fetching gas price:", error);
      }
    };

    fetchGasPrice();
  }, []);

  return (
    <footer
      className={cn(
        "w-[95%] max-w-full justify-between items-center text-white absolute bottom-0 left-0 z-10 m-4 hidden",
        "md:flex",
      )}
    >
      <StolenMoneyTracker />
      <div className="w-72">
        <span className="font-bold z-0">Current Gas Price: </span>
        {!!gasPrice ? <span>{gasPrice.toFixed(4)} Gwei</span> : <span>loading...</span>}
        <div className="flex items-center mt-2 z-0">
          <span className="text-sm text-cyan-500 mr-2 z-0">Gas is cheap</span>
          <Progress value={gasPrice} />
          <span className="text-sm text-red-500 ml-2 z-0">Gas is expensive</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
