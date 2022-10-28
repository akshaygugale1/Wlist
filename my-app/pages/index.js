import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { Contract, providers } from "ethers";
import { ABI, CONTRACT_ADDRESS } from "../constants";

export default function Home() {
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);

  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      await checkIfAddressIsWhitelisted();
      await getNumberOfAddressesWhitlisted();
    } catch (error) {
      console.error(error);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    try {
      const provider = await web3ModalRef.current.connect();
      //console.log(provider);
      const web3Provider = new providers.Web3Provider(provider);

      const { chainId } = await web3Provider.getNetwork();
      console.log(web3Provider);
      if (chainId !== 5) {
        window.alert("Please connect to Goreli network");
        throw new Error("Please connect to Goerli");
      }

      if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
    } catch (error) {
      console.error(error);
    }
  };

  const checkIfAddressIsWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner(true);

      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

      const myAddress = await provider.getAddress();

      const _joinedWhitelist = await contract.addressesWhitelistedd(myAddress);

      setJoinedWhitelist(_joinedWhitelist);
    } catch (error) {
      console.error(error);
    }
  };

  const getNumberOfAddressesWhitlisted = async () => {
    try {
      const provider = await getProviderOrSigner();

      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

      const _joinedWhitelist = await contract.numOfAddtessWhitelisted();

      setNumberOfWhitelisted(_joinedWhitelist);
    } catch (error) {
      console.error(error);
    }
  };

  const addAdressToWhitelist = async () => {
    try {
      const provider = await getProviderOrSigner(true);

      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

      setLoading(true);
      const tx = await contract.addAddressToWhitelist();

      await tx.wait();
      setLoading(false);
      setJoinedWhitelist(true);

      await getNumberOfAddressesWhitlisted();
    } catch (error) {
      console.error(error);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>Thanks for joining whitelist</div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading..</button>;
      } else {
        return (
          <button className={styles.button} onClick={addAdressToWhitelist}>
            Join Whitelist
          </button>
        );
      }
    } else {
      return (
        <button className={styles.button} onClick={connectWallet}>
          Connect Wallet
        </button>
      );
    }
  };
  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      console.log(web3ModalRef.current);
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}
