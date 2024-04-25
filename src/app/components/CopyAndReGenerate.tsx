"use client";
import React, { Fragment } from "react";
import { Button } from "@/components/atoms/Button";
import useCopy from "@/hooks/useCopy";
import { confirmationStore } from "@/store/firebase";
import useFirebaseCacheToken from "@/hooks/useFirebaseCacheToken";
import { useRouter } from "next/navigation";

const CopyAndReGenerate = () => {
  const router = useRouter()
  const { deleteToken } = useFirebaseCacheToken();

  const { firebaseToken, onUpdateToken } = confirmationStore((store) => store);
  const { isCopied, onCopy } = useCopy();

  const handleDeleteToken = () => {
    deleteToken();
    onUpdateToken(null);
    router.push('/generate_token')
  };

  return (
    <Fragment>
      <Button
        disabled={isCopied}
        onClick={() => onCopy(firebaseToken ?? "")}
        label={isCopied ? "Copied!" : "Copy Token"}
      />

      <Button onClick={handleDeleteToken} label="Delete Token" />
    </Fragment>
  );
};

export default CopyAndReGenerate;
