import {
  Account,
  ProgramManager,
  ProgramManagerBase,
  PrivateKey,
  initThreadPool,
  AleoKeyProvider,
  AleoNetworkClient,
  NetworkRecordProvider,
} from "@aleohq/sdk";
import { expose, proxy } from "comlink";

await initThreadPool();

async function programExecution(privateKey, program, aleoFunction, inputs) {
  const keyProvider = new AleoKeyProvider();
  keyProvider.useCache(true);

  // Create a record provider that will be used to find records and transaction data for Aleo programs
  const networkClient = new AleoNetworkClient("https://api.explorer.aleo.org/v1");

  // Use existing account with funds
  const account = new Account({
    privateKey,
  });

  const recordProvider = new NetworkRecordProvider(account, networkClient);

  const programManager = new ProgramManager(
    "https://api.explorer.aleo.org/v1",
    keyProvider,
    recordProvider,
  );

  programManager.setAccount(account);

  // Estimate the execution fee for the program
  const fee = ProgramManagerBase.estimateExecutionFee(
    account.privateKey(),
    program,
    aleoFunction,
    inputs,
    "https://api.explorer.aleo.org/v1"
  );

  // Execute the program on the Aleo network
  const tx_id = await programManager.execute({
    programName: program,
    functionName: aleoFunction,
    fee,
    privateFee: false,
    inputs,
    privateKey: account.privateKey(),
});
  return tx_id;
}

async function getPrivateKey() {
  const key = new PrivateKey();
  return proxy(key);
}

// async function deployProgram(privateKey, program) {
//   const keyProvider = new AleoKeyProvider();
//   keyProvider.useCache(true);

//   // Create a record provider that will be used to find records and transaction data for Aleo programs
//   const networkClient = new AleoNetworkClient("https://api.explorer.aleo.org/v1");

//   // Use existing account with funds
//   const account = new Account({
//     privateKey,
//   });

//   const recordProvider = new NetworkRecordProvider(account, networkClient);

//   // Initialize a program manager to talk to the Aleo network with the configured key and record providers
//   const programManager = new ProgramManager(
//     "https://api.explorer.aleo.org/v1",
//     keyProvider,
//     recordProvider,
//   );

//   programManager.setAccount(account);

//   // Define a fee to pay to deploy the program
//   const fee = 1.9; // 1.9 Aleo credits

//   // Deploy the program to the Aleo network
//   const tx_id = await programManager.deploy(program, fee);

//   // Optional: Pass in fee record manually to avoid long scan times
//   // const feeRecord = "{  owner: aleo1xxx...xxx.private,  microcredits: 2000000u64.private,  _nonce: 123...789group.public}";
//   // const tx_id = await programManager.deploy(program, fee, undefined, feeRecord);

//   return tx_id;
// }

const workerMethods = { programExecution, getPrivateKey };
expose(workerMethods);
