import React, { useState } from 'react'
import DataTable from 'react-data-table-component';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const Admin = ({candidates,contract,getTime}) => {
    const [time,updateTime] = useState('');

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
        {
            name:"delete",
            cell:()=>{
                <Icon icon="ic:baseline-delete" />
            },
            center:true,
        }
      ];

    const setTime = async() =>{
		try {
			const _timestamp = await contract.setTimeForVoting(time*3600);
            getTime();
		} catch(err) {
			console.log(err)
		}
	}

  return (
    <div className='min-h-screen flex items-center '>
        <Link  to='/' className="absolute top-14 left-10 underline">Back</Link>
        <div className='justify-center content-center pt-6 w-3/5 mx-auto'>
        <div className='pb-10'>
        <label>Set Voting Time</label>
        <input className='ml-10 text-black' type="number" placeholder="Enter Value in Hours" value={time} onChange={(e)=>{
            console.log(e.target.value)
            updateTime(e.target.value)}}/>
        <button onClick={()=>setTime()} className='ml-10 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'>Change</button>
        </div>
        <DataTable title="Information" columns={columns} data={candidates} />
        </div>
    </div>
  )
}

export default Admin