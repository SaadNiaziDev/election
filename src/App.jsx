import { useState, useEffect } from "react";
import { useAccount, useContract, useSigner } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./components/Contract";

import AddCandidate from "./Components/AddCandidate";
import Voting from "./Components/Voting";
import { Web3Button } from "@web3modal/react";
import Result from "./components/Result";
import Swal from "sweetalert2";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Countdown from "react-countdown";
import Admin from "./components/Admin";

function App() {

	const [candidates, setCandidates] = useState([])
	const [totalVotes, setTotalVotes] = useState(0)
	const [time,setTime] = useState(0)

	const { address } = useAccount()
	const { data: signer } = useSigner()
	const contract = useContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		signerOrProvider: signer
	})

	const Toast = Swal.mixin({
		toast: true,
		position: 'center',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
	})

	const addCandidate = async(name, party, imageUri) => {
		console.log(name, party, imageUri)
		try {
			const tx = await contract.addParticipant(name, party, imageUri)
			Swal.fire({
				title:"Adding Candidate",
				text:"Please wait until candidiate is added",
				didOpen:()=>{
					Swal.showLoading();
				}
			})
			await tx.wait();
			Toast.fire({
				icon: 'success',
				title: 'Candidate added successfully'
			  })
		} catch(err) {
			console.log(err)
			Toast.fire({
				icon: 'error',
				title: "Please wait for voting to end",
			  })
		}
	}

	const vote = async(candidateId) => {
		try {
			const tx = await contract.castVote(candidateId)
			Swal.fire({
				title:"Casting Vote",
				text:"Please wait until vote is casted",
				didOpen:()=>{
					Swal.showLoading();
				}
			})
			await tx.wait();
			Toast.fire({
				icon: 'success',
				title: 'Vote casted successfully'
			  })
		} catch(err) {
			console.log(err)
		}
	}

	const getCandidates = async() => {
		try {
			const count = await contract.candidateCount()
			console.log("Candidate Count ", count.toString())
			let candidatesArr = []
			for(let i = 1; i <= count; i++) {
				const candidate = await contract.participants(i)
				let VoteCount = await getVotes(i)
				let candidate_obj = {
					name: candidate.name,
					party: candidate.party,
					imageUri: candidate.imgURL,
					totalVotes:VoteCount
				}
				candidatesArr.push(candidate_obj)
			}
			setCandidates(candidatesArr)
		} catch(err) {
			console.log(err)
		}
	}

	const getTotalVotes = async() => {
		try {
			const count = await contract.totalVotes()
			console.log("Total Votes ", count.toString())
			setTotalVotes(count.toString())
		} catch(err) {
			console.log(err)
		}
	}

	const getTime = async() =>{
		try {
			const _timestamp = await contract.timePeriod();
			setTime(_timestamp)
		} catch(err) {
			console.log(err)
		}
	}

	const getOwner = async() =>{
		try {
			const _owner = await contract.owner();
			return _owner == address; 
		} catch(err) {
			console.log(err)
		}
	}

	const getVotes = async(index)=>{
		try {
			const votes = await contract.votes(index);
			return votes.toString();
		} catch (error) {
			console.log(error)
		}
	}

	const Completionist = () => <span className="text-4xl font-medium py-8 text-green-500">Voting has been completed</span>;

	const renderer = ({ hours, minutes, seconds, completed }) => {
		if (completed) {
		  // Render a completed state
		  return <Completionist />;
		} else {
		  // Render a countdown
		  return <span className="text-4xl font-medium py-8">{hours}:{minutes}:{seconds}</span>;
		}
	  };

	useEffect(() => {
		if(contract) {
			getCandidates()
			getTotalVotes()
			getTime()
		}
    }, [contract])

	return (
		<div className="bg-black text-white">
			<Navbar/>
			<div className="w-full h-10 flex items-center">
			<div className="justify-center content-center pt-6 mx-auto">
			{time ==0 ?<span className="text-4xl font-medium py-8 text-grey-500">Voting will start soon by Adminstator</span> : <Countdown date={time*1000} renderer={renderer} />}
			</div>
			</div>
			<Routes>
				<Route path="/" element={<Home totalVotes={totalVotes} address={address} getOwner={getOwner}/>}/>
				<Route path="/addCandidate" element={<AddCandidate addCandidate={addCandidate}/>}/>        
				<Route path="/vote" element={<Voting vote={vote} candidates={candidates}/>}/>
				<Route path="/result" element={<Result candidates={candidates}/>}/>  
				{getOwner && <Route path="/admin" element={<Admin candidates={candidates} contract={contract} getTime={getTime}/>}/>}             
        	</Routes>
		</div>
	);
}

export default App;