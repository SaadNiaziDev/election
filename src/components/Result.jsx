import React from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

const Result = ({ candidates }) => {
  const columns = [
    {
      name: "Candidates",
      selector: (row) => row.name,
    },
    {
      name: "VoteCount",
      selector: (row) => row.totalVotes,
      center: true,
    },
  ];

  return (
    <>
      <Link
        className="absolute top-14 left-10 underline"
        to='/'
      >
        Back
      </Link>
      <div className="min-h-screen flex items-center">
    <div className="justify-center content-center pt-6 w-3/5 mx-auto">
      <DataTable title="Result" columns={columns} data={candidates} />
    </div>
    </div>
    </>
  );
};

export default Result;
