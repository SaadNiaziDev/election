import { Web3Button } from "@web3modal/react";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between flex-row px-4 py-2">
      {/* Logo */}
      <h1 className="text-2xl font-bold">Election</h1>
      <p className="font-light">Please use avalanche fuji chain to cast vote</p>
      <Web3Button />
    </div>
  );
};

export default Navbar;
