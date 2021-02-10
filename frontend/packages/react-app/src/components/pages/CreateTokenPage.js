import * as React from "react";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import useCeramic from "../../hooks/useCeramic";
import { useEffect, useState } from "react";
import useTokenBasicInfo from "../../hooks/useTokenBasicInfo";
import useIdxBasicProfile from "../../hooks/useIdxBasicProfile";
import { CreateTokenPageTemplate } from "../templates/CreateTokenPageTemplate";
import { useHistory, useParams } from "react-router-dom";
import useManifestoModel from "../../hooks/useManifestoModel";
import useThreadDB from "../../hooks/useThreadDB";
import useCreateToken from "../../hooks/useCreateToken";

function CreateTokenPage() {
  const history = useHistory();
  const { docId } = useParams();
  const isNew = docId === undefined;

  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const { ceramic, idx } = useCeramic(provider);
  const {
    name,
    setName,
    imageURL,
    setImageURL,
    saveIdxBasicProfile,
  } = useIdxBasicProfile(idx);
  const [imageFile, setImageFile] = useState(undefined);
  const [isSaved, setIsSaved] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [manifestoFile, setManifestoFile] = useState(undefined);
  const { client } = useThreadDB();
  const { manifesto, getManifesto, saveManifesto } = useManifestoModel(
    client,
    idx
  );
  const {
    doc,
    isUpdated,
    error,
    tokenBasicInfo,
    getTokenBasicInfo,
    setTokenBasicInfo,
    saveTokenBasicInfo,
    updateTokenBasicInfo,
  } = useTokenBasicInfo(ceramic, idx);
  const { deployedAddress, createToken } = useCreateToken(provider);

  useEffect(() => {
    setIsSaved(docId !== undefined);
  }, [docId, setIsSaved]);

  useEffect(() => {
    getTokenBasicInfo(docId);
  }, [docId, getTokenBasicInfo]);

  useEffect(() => {
    getManifesto(docId);
  }, [getManifesto, docId]);

  useEffect(() => {
    updateTokenBasicInfo(doc, deployedAddress);
  }, [doc, deployedAddress, updateTokenBasicInfo]);

  useEffect(() => {
    if (!isUpdated || doc === undefined) {
      return;
    }
    history.push(`/token/${doc.id.toString()}`);
  }, [isUpdated, history, doc]);

  useEffect(() => {
    const f = async () => {
      if (!isNew || doc === undefined) {
        return;
      }
      await saveManifesto(doc);
    };
    f();
  }, [isNew, doc, error, saveManifesto]);

  return (
    <CreateTokenPageTemplate
      createToken={createToken}
      doc={doc}
      image={imageURL}
      imageFile={imageFile}
      manifesto={manifesto}
      manifestoFile={manifestoFile}
      name={name}
      pdfName={pdfName}
      isSaved={isSaved}
      setIsSaved={setIsSaved}
      saveTokenBasicInfo={saveTokenBasicInfo}
      saveIdxBasicProfile={saveIdxBasicProfile}
      setImage={setImageURL}
      setImageFile={setImageFile}
      setManifestoFile={setManifestoFile}
      setName={setName}
      setPdfName={setPdfName}
      setTokenBasicInfo={setTokenBasicInfo}
      tokenBasicInfo={tokenBasicInfo}
      provider={provider}
      loadWeb3Modal={loadWeb3Modal}
      logoutOfWeb3Modal={logoutOfWeb3Modal}
    />
  );
}

export default CreateTokenPage;
