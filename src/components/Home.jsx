import { Web3Button } from "@web3modal/react";
import React from "react";
import { Link } from "react-router-dom";

const Home = ({totalVotes,address,getOwner}) => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <h1 className="text-4xl font-extrabold">Election</h1>
      {address ? (
        <div className="flex flex-row gap-4 items-center justify-center">
          <Link
            to='/addCandidate'
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add Candidate
          </Link>
          <Link
            to='/vote'
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Vote
          </Link>
          <Link
            to='/result'
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Results
          </Link>
          {getOwner && <Link
            to='/admin'
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Admin
          </Link>}
        </div>
      ) : (
        <Web3Button />
      )}
      <h3>Total Vote casted : {totalVotes}</h3>
    </div>
  );
};

export default Home;
