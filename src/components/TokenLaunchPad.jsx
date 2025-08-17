import React, { useState, useMemo } from "react";
import Card from "./ui/Card";
import Input from "./ui/Input";
import Button from "./ui/Button";

export const TokenLaunchPad = () => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [image, setImage] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
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
    const n = Number(initialSupply);
    if (!initialSupply.toString().trim())
      e.initialSupply = "Initial supply is required";
    else if (Number.isNaN(n) || n <= 0)
      e.initialSupply = "Initial supply must be a number greater than 0";
    return e;
  }, [name, symbol, image, initialSupply]);

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
      console.log("Create token", { name, symbol, image, initialSupply });
      setCreating(false);
      // reset form if you want
      // setName(''); setSymbol(''); setImage(''); setInitialSupply('')
    }, 700);
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

            <div>
              <label className="text-sm font-medium">Initial Supply</label>
              <Input
                value={initialSupply}
                onChange={(e) => setInitialSupply(e.target.value)}
                onBlur={() => handleBlur("initialSupply")}
                placeholder="1000000"
                type="number"
                className={
                  touched.initialSupply && errors.initialSupply
                    ? "border-destructive"
                    : ""
                }
              />
              {touched.initialSupply && errors.initialSupply && (
                <div className="text-xs text-destructive mt-1">
                  {errors.initialSupply}
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
