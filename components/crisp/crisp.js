"use client"

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

const MY_CRISP_WEBSITE_ID = '1a597bf9-8fd6-4c32-8b97-2ff19ebafa2e'


const CrispChat = () => {
  useEffect(() => {
    Crisp.configure(`${MY_CRISP_WEBSITE_ID}`);
  });

  return null;
}

export default CrispChat;