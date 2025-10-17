export const GREETER_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GREETER_CONTRACT_ADDRESS as `0x${string}`

export const GREETER_ABI = [{
    "type": "constructor",
    "inputs": [{
        "name": "_initialGreeting",
        "type": "string",
        "internalType": "string"
    }],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "greet",
    "inputs": [],
    "outputs": [{
        "name": "",
        "type": "string",
        "internalType": "string"
    }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "greeting",
    "inputs": [],
    "outputs": [{
        "name": "",
        "type": "string",
        "internalType": "string"
    }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "setGreeting",
    "inputs": [{
        "name": "_newGreeting",
        "type": "string",
        "internalType": "string"
    }],
    "outputs": [],
    "stateMutability": "nonpayable"
}]
