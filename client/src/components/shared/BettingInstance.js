import Betting from "../../contracts/Betting.json";
import getWeb3 from "../../getWeb3";
let web3;
const init = async () => {
  web3 = await getWeb3();
};
init();
export default (BettingDeployedAddress) => {
  return new web3.eth.Contract(Betting.abi, BettingDeployedAddress);
};
