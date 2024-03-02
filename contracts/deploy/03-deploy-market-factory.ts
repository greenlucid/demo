import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployMarketFactory: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, getChainId } = hre;
  const { deploy } = deployments;

  // fallback to hardhat node signers on local network
  const namedAccounts = await getNamedAccounts()
  const deployer = namedAccounts.deployer ?? (await hre.viem.getWalletClients())[0].account.address;
  const governor = namedAccounts.governor ?? (await hre.viem.getWalletClients())[0].account.address;
  const chainId = Number(await getChainId());
  console.log("deploying to chainId %s with deployer %s", chainId, deployer);

  const market = await deployments.get("Market");
  const arbitrator = await deployments.get("Arbitrator");
  const reality = await deployments.get("Reality");
  const wrappedERC20Factory = await deployments.get("WrappedERC20Factory");
  const conditionalTokens = await deployments.get("ConditionalTokens");
  const collateralToken = await deployments.get("CollateralToken");
  const realityProxy = await deployments.get("RealityProxy");

  await deploy("MarketFactory", {
    from: deployer,
    args: [
      market.address,
      arbitrator.address,
      reality.address,
      wrappedERC20Factory.address,
      conditionalTokens.address,
      collateralToken.address,
      realityProxy.address,
      governor,
    ],
    log: true,
  });
};

export default deployMarketFactory;