"use client";
import React, { Fragment } from "react";
import { Button } from "@/components/atoms/Button";
import useCopy from "@/hooks/useCopy";
import { confirmationStore } from "@/store/firebase";
import useFirebaseCacheToken from "@/hooks/useFirebaseCacheToken";

const CopyAndReGenerate = () => {
  const { deleteToken } = useFirebaseCacheToken();

  const { firebaseToken, onUpdateToken } = confirmationStore((store) => store);
  const { isCopied, onCopy } = useCopy();

  const handleDeleteToken = () => {
    deleteToken();
    onUpdateToken(null);

    window.location.reload();
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
