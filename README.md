# StepCoin - Proof of Health

## Project Description
### Intoduction
Movement is life. One who walks a sufficient distance every day is a healthy person.  A healthy person eats healthy food, goes to the gym, and almost never visits a doctor.  

This project helps to proof your sport fitness by converting your steps into a token - the StepCoin.   Now all your activity - your steps will be recorded in an immutable blockchain. it gives your proof of your fit and helps to connect with businesses who offer goods for runners without intermediately.

### Benefits
User: 
1. Own Stepcoins token by submitting his/her steps via the dApp
2. Redeem Stepcoins to get award (for example, discount in sport shop)
3. Redeem Stepcoints for a discount for medical insurance 
4. Redeem Stepcoints for a discount to a gym

Businesses:
1. Get access to the target audience (fit & healthly)
2. Promote new products
3. Sell sport event tickets (NFT)

### Future plans
1. Sync sport braslet (and watch) with Oracle, and smart contract can get information about daily steps from Oracle.
2. Business can airdrop NFT (event tickets) to top runners
3. Gamification: open competitions for a prize


# Public Deployed version of dApp:
-https://mydApp.io
 
# Prerequisites
- node.js 14.17.x
- npm 6.14.x
- Metamask extension for browser (e.g, Chrome extension, ver. 10.3.0 +)
- Truffle 5.4.x : `npm install -g truffle`
- Optional:
    - Open Zeppelin library: `npm install @openzeppelin/contracts`
    - Rimple UI: `npm install --save rimble-ui styled-components`

# Folder structure
- `client`: React project front-end
- `contracts`: Solidity smart contract StepCoin.sol
- `migrations`: Migrations files for deploying contract from `contracts` folder
- `test`: JavaScript test file `step_coin.js` to test smart contract.


# How to run locally
1. Git clone this repo: `https://github.com/artemgalimzyanov/blockchain-developer-bootcamp-final-project`
2. Open terminal, go to client folder in project directory and run `npm install`
3. Open another terminal window, go to the project directory and run private Ethereum network on 127:0.0.1:8545 by running `truffle develop` (remember mnemonic printed in terminal)
4. Compile and migrate contract: `migrate`
5. Go to browser, open Metamask, import account by using mnemonic from Step 3.
6. Open another terminal window, go to the project directory and run `cd client && npm run start`
7. Open browser `localhost:3000
8. Enjoy and play with StepCoin dApp


# Screencast link
-`https://www.loom.com/share/a7f57fc01c7248799e204ea0b6a443ee`

# Public ETH address for certification
`0x325173bC8C0F68eA1384de0377786EA3284Cf2FB`

# Testing
- Go to the project directory and run `truffle test`
