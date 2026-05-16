import {useState} from "react";
import Modal from "../shared/Modal";
import Button from "../shared/Button";
import {useJobsContext} from "../../context/JobContext";
import {createPublicClient, createWalletClient, custom, http, parseEther} from 'viem'
import { mainnet } from 'viem/chains'
import {monadTestnet} from "../../monadClient.js";
import * as client from "viem/actions";

function PostJobModal({
                        open,
                        onClose
                      }) {
  const {addJob} = useJobsContext();

  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [category, setCategory] = useState("Design");
  const [timeline, setTimeline] = useState(14);
  const [budget, setBudget] = useState("");
  const [skills, setSkills] = useState("");

  const amount = parseFloat(budget) || 0;
  const fee = amount * 0.03;
  const total = amount + fee;



  const submitJob = async() => {

    console.log("submitJob");
    const walletClient = createWalletClient({
      chain: monadTestnet,
      // This hooks directly into MetaMask/browser wallets
      transport: custom(window.ethereum)
    });

    const [address] = await walletClient.requestAddresses()

    if (!title || !budget) return;

    const { request } = await client.simulateContract({
      address: "bd3830f81b47ee81770b203afea1df5ae5e8571089f4d1674663028350e09e54",
      abi: abi,
      functionName: "submitWork",
      args: [jobId], // Pass the single jobId string in the array
      account: account, // The freelancer wallet address trying to run it
    })

    const hash = await client.writeContract({

    })

    addJob({
      id: Date.now(),
      title,
      company: "ChainWork",
      amount,
      budget,
      status: "hiring",
      tags: skills.split(",").map((s) => s.trim()).filter(Boolean),
      daysLeft: Number(timeline),
      progress: 0,
      meta: `Posted just now · Ends in ${timeline} days`,
      applicantInitials: [],
    });

    // reset
    setTitle("");
    setDesc("");
    setBudget("");
    setSkills("");
    setTimeline(14);
    onClose();
  };

  return (
    <Modal open={open}
           onClose={onClose}
           title="Post a New Job">
      {/* Info box */}
      <div className="info-box purple"
           style={{marginBottom: "1.2rem"}}>
        <div className="icon">🔒</div>
        <p>
          Your payment is{" "}
          <strong>locked in a smart contract escrow</strong> when you post.
          Funds only release when you approve submitted work — fully on-chain
          and trustless.
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">Job Title</label>
        <input
          className="form-input"
          placeholder="e.g. DeFi Dashboard UI Design"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          placeholder="Describe the work, deliverables, and requirements..."
          value={description}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px"
      }}>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Design</option>
            <option>Development</option>
            <option>Smart Contracts</option>
            <option>Marketing</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Timeline (days)</label>
          <input
            type="number"
            className="form-input"
            min="1"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Payment Amount (USD)</label>
        <div className="amount-input-wrap">
          <span className="currency">$</span>
          <input
            type="number"
            className="form-input"
            placeholder="0.00"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
      </div>

      {/* Escrow breakdown */}
      <div className="panel"
           style={{marginBottom: "1.2rem"}}>
        <div className="panel-body">
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--muted)",
              marginBottom: "8px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Escrow Breakdown
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.875rem",
            marginBottom: "6px"
          }}>
            <span style={{color: "var(--muted)"}}>Payment to freelancer</span>
            <span style={{fontFamily: "var(--font-mono)"}}>${amount.toFixed(2)}</span>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.875rem",
            marginBottom: "6px"
          }}>
            <span style={{color: "var(--muted)"}}>Platform fee (3%)</span>
            <span style={{
              fontFamily: "var(--font-mono)",
              color: "var(--muted)"
            }}>${fee.toFixed(2)}</span>
          </div>

          <div
            style={{
              borderTop: "1px solid var(--border)",
              margin: "8px 0",
              paddingTop: "8px",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 600,
            }}
          >
            <span>Total locked on-chain</span>
            <span style={{
              fontFamily: "var(--font-mono)",
              color: "var(--teal)"
            }}>
              ${total.toFixed(2)}
            </span>
          </div>

          <div className="chain-visual"
               style={{padding: "8px 0 0"}}>
            <div className="chain-block">Your wallet</div>
            <span className="chain-arrow">→</span>
            <div className="chain-block"
                 style={{color: "var(--green)"}}>Smart Contract
            </div>
            <span className="chain-arrow">→</span>
            <div className="chain-block">Freelancer</div>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Skills Required</label>
        <input
          className="form-input"
          placeholder="e.g. Figma, React, Solidity (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
      </div>

      <div style={{
        display: "flex",
        gap: "10px",
        marginTop: "0.5rem"
      }}>
        <Button variant="outline"
                onClick={onClose}
                style={{flex: 1}}>
          Cancel
        </Button>
        <Button onClick={submitJob}
                style={{flex: 2}}>
          🔒 Lock Funds & Post Job
        </Button>
      </div>
    </Modal>
  );
}

export default PostJobModal;