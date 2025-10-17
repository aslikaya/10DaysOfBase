"use client";
//useState a react hook for changing values in components
//useEffect a react hook for a code to run when a component first rendered
//or its value changed
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
// useAccount to get the info from the connected wallet
import { useAccount, useBalance, useSignMessage } from "wagmi";
//Entry point to the app
export default function Home() {

  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { signMessage, data: signature, isPending: isSignPending } = useSignMessage();
  const [message, setMessage] = useState("Hello from Base Sepolia");

  // '?.' provides optional chaining, if 'chain' is undefined, it won't give errors
  const isCorrectNetwork = chain?.id === Number(process.env.NEXT_PUBLIC_CHAIN_ID);

  const handleSignMessage = () => {
    signMessage({ message });
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <Wallet />
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>Base Batches Prep #2</h1>

        {isConnected && address && (
          <div className={styles.section}>
            {/* Network Warning */}
            {!isCorrectNetwork && (
              <div className={styles.errorMessage}>
                <p>Wrong Network! Please switch to Base Sepolia in your wallet.</p>
                <p className={styles.networkInfo}>Current: {chain?.name || 'Unknown'} | Required: Base Sepolia (Chain id: {process.env.NEXT_PUBLIC_CHAIN_ID})</p>
              </div>
            )}
            {/* Balance Display */}
            <div className={styles.card}>
              <p className={styles.label}>Connected Address:</p>
              <p className={styles.address}>{address}</p>

              {balance && (
                <div className={styles.balanceSection}>
                  <p className={styles.label}>ETH Balance:</p>
                  <p className={styles.balance}>
                    {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                  </p>
                </div>
              )}
            </div>
            {/* Message Signing */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Sign a Message (Gasless)</h2>

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={styles.input}
                placeholder="Enter a message to sign"
              />

              <button
                onClick={handleSignMessage}
                disabled={isSignPending}
                className={styles.button}
              >
                {isSignPending ? "Signing..." : "Sign Message"}
              </button>

              {signature && (
                <div className={styles.signatureSection}>
                  <p className={styles.label}>Signature:</p>
                  <p className={styles.signature}>{signature}</p>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
