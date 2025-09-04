import React, { useState, useMemo } from "react";
import Card from "./ui/Card";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint } from "@solana/spl-token";

export const TokenLaunchPad = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [image, setImage] = useState("");
  const [creating, setCreating] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    symbol: false,
    image: false,
    initialSupply: false,
  });

  const isValidUrl = (value) => {
    if (!value) return true; // optional
    try {
      const u = new URL(value);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const errors = useMemo(() => {
    const e = {};
    if (!name.trim()) e.name = "Token name is required";
    if (!symbol.trim()) e.symbol = "Symbol is required";
    else if (!/^[A-Za-z0-9]{1,6}$/.test(symbol.trim()))
      e.symbol = "Symbol must be 1–6 letters or numbers";
    if (image && !isValidUrl(image))
      e.image = "Enter a valid URL (http(s)://...)";
    return e;
  }, [name, symbol, image]);

  const isFormValid = Object.keys(errors).length === 0;

  const handleBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }));
  };

  const createToken = () => {
    if (!isFormValid) {
      // show all errors
      setTouched({
        name: true,
        symbol: true,
        image: true,
        initialSupply: true,
      });
      return;
    }

    setCreating(true);
    setTimeout(() => {
      console.log("Create token", { name, symbol, image });
      setCreating(false);
      // reset form if you want
      // setName(''); setSymbol(''); setImage(''); setInitialSupply('')
    }, 700);

    const mintNewToken = async () => {
      if (!connection) return;

      try {
        const mintKeypair = Keypair.generate();
        const lamports = await getMinimumBalanceForRentExemptMint(connection);
        const transaction = new Transaction().add(
          SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: MINT_SIZE,
                lamports,
                programId: TOKEN_PROGRAM_ID,
          }),
          createInitializeMint2Instruction(mintKeypair.publicKey, 9, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID)
        );
        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.partialSign(mintKeypair);

        const signedTransaction = await wallet.signTransaction(transaction);
        const txId = await connection.sendRawTransaction(signedTransaction.serialize());
        await connection.confirmTransaction(txId, 'confirmed');
        console.log("Token minted with address:", mintKeypair.publicKey.toBase58());
        console.log("Transaction ID:", txId);
        

      } catch (error) {
        console.error("Error minting token:", error);
      }
    };

    mintNewToken();

  };

  return (
    <div className="min-h-[86vh] flex items-center justify-center bg-gradient-to-b from-secondary/5 to-background ">
      <div className="w-full max-w-3xl flex flex-col items-center justify-center">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">Solana Token Launchpad</h1>
          <p className="text-sm  mt-2">
            Create and preview your SPL token with a beautiful, minimal form.
          </p>
        </div>

        <Card>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Token Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="e.g. My Token"
                className={
                  touched.name && errors.name ? "border-destructive" : ""
                }
              />
              {touched.name && errors.name && (
                <div className="text-xs text-destructive mt-1">
                  {errors.name}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Symbol</label>
              <Input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                onBlur={() => handleBlur("symbol")}
                placeholder="e.g. MTK"
                className={
                  touched.symbol && errors.symbol ? "border-destructive" : ""
                }
              />
              {touched.symbol && errors.symbol && (
                <div className="text-xs text-destructive mt-1">
                  {errors.symbol}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                onBlur={() => handleBlur("image")}
                placeholder="https://..."
                className={
                  touched.image && errors.image ? "border-destructive" : ""
                }
              />
              {touched.image && errors.image && (
                <div className="text-xs text-destructive mt-1">
                  {errors.image}
                </div>
              )}
            </div>

            

            <div className="pt-4 flex items-center justify-between">
              <div className="text-sm text-muted">
                Preview: <span className="font-medium">{name || "—"}</span> (
                <span className="font-mono">{symbol || "—"}</span>)
              </div>
              <Button
                onClick={createToken}
                disabled={creating}
                className={creating ? "opacity-70 pointer-events-none" : ""}
              >
                {creating ? "Creating..." : "Create token"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TokenLaunchPad;
