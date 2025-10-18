import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { GREETER_ABI, GREETER_CONTRACT_ADDRESS } from "../contracts/Greeter";
import { baseSepolia } from "wagmi/chains";

export const useGreeter = () => {
    //Calling greet() function in the smart contract 
    // and keeps the output in greeting variable
    // if error happens, it will be kept in `readError`
    const { data: greeting, refetch: refetchGreeting, error: readError } = useReadContract({
        address: GREETER_CONTRACT_ADDRESS,
        abi: GREETER_ABI,
        functionName: 'greet',
        chainId: baseSepolia.id,
    })

    // `writeFunction` is the function needed to write to a contract
    const {
        writeContract,
        data: transactionHash,
        isPending: isWritePending,
        error: writeError,
    } = useWriteContract()

    // Waiting for the confirmation after transaction sent to the mempool
    // tracks the transaction with its hash
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        error: confirmError,
    } = useWaitForTransactionReceipt({
        hash: transactionHash,
        chainId: baseSepolia.id,
    })

    // Calling the `setGreeting()` function from the smart contract
    const setGreeting = (greeting: string) => {
        writeContract({
            address: GREETER_CONTRACT_ADDRESS,
            abi: GREETER_ABI,
            functionName: 'setGreeting',
            args: [greeting],
            chainId: baseSepolia.id,
        })
    }

    return {
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
    }
}

