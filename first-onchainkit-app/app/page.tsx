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
import { useGreeter } from "@/src/hooks/useGreeter";
//Entry point to the app
export default function Home() {

  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { signMessage, data: signature, isPending: isSignPending } = useSignMessage();
  const [message, setMessage] = useState("Hello from Base Sepolia");

  const {
    greeting,
    refetchGreeting,
    readError,
    transactionHash,
    isWritePending,
    writeError,
    isConfirming,
    isConfirmed,
    confirmError,
    setGreeting,
  } = useGreeter();
  const [newGreeting, setNewGreeting] = useState("");

  // '?.' provides optional chaining, if 'chain' is undefined, it won't give errors
  const isCorrectNetwork = chain?.id === Number(process.env.NEXT_PUBLIC_CHAIN_ID);

  useEffect(() => {
    if (isConfirmed && transactionHash) {
      //fetches the updated new greeting 
      // `greeting` is not reactive to blockchain changes
      //so when greeting is changed on the blockchain, you need to refetch
      refetchGreeting();
      setNewGreeting(""); //clears the input
    }
  }, [isConfirmed, transactionHash]);

  const handleSetGreeting = () => {
    // `trim()`deletes empty spaces at the beginning and at the end
    // true if the string is not empty after trim
    if (newGreeting.trim()) { // 
      setGreeting(newGreeting);
    }
  };

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

              <div className={styles.card}>
                <h2 className={styles.card}>Greeter Contract</h2>
                <div className={styles.greetingDisplay}>
                  <p className={styles.label}>Current greeting:</p>
                  <p className={styles.currentGreeting}>
                    {greeting ? String(greeting) : "Loading..."}</p>
                </div>

                <div className={styles.updateSection}>
                  <p className={styles.label}>Update Greeting:</p>
                  <input
                    type="text"
                    value={newGreeting}
                    onChange={(e) => setNewGreeting(e.target.value)}
                    className={styles.input}
                    placeholder="Enter new greeting"
                  />
                  <button
                    onClick={handleSetGreeting}
                    disabled={isWritePending || isConfirming || !newGreeting.trim()}
                    className={styles.button}
                  >
                    {isWritePending
                      ? "Sending Transaction..."
                      : isConfirming
                        ? "Confirming"
                        : "Update Greeting"}
                  </button>
                </div>
                {transactionHash && (
                  <div className={styles.transactionSection}>
                    <p className={styles.label}>Transaction Hash:</p>
                    <a
                      href={`https://sepolia.basescan.org/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.txLink}
                    >
                      {transactionHash}
                    </a>
                  </div>
                )}

                {isConfirmed && (
                  <div className={styles.successMessage}>
                    <p>Greeting updated successfully!</p>
                  </div>
                )}

                {(writeError || confirmError) && (
                  <div className={styles.errorMessage}>
                    <p>Error: {writeError?.message || confirmError?.message}</p>
                  </div>
                )}
                {readError && (
                  <div className={styles.errorMessage}>
                    <p>Failed to read contract. Check contract address and network</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!isConnected && (
          <p className={styles.connectPrompt}>
            Connect your wallet to get started
          </p>
        )}
      </div>
    </div>
  );
}
