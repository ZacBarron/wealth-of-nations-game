import {
  alchemy,
  createAlchemySmartAccountClient,
  arbitrumSepolia,
} from "@account-kit/infra";
import { createLightAccount } from "@account-kit/smart-contracts";
import { LocalAccountSigner } from "@aa-sdk/core";
import { generatePrivateKey } from "viem/accounts";

const alchemyTransport = alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
});

export const createClient = async () => {
  return createAlchemySmartAccountClient({
    transport: alchemyTransport,
    policyId: process.env.NEXT_PUBLIC_GAS_POLICY_ID!,
    chain: arbitrumSepolia,
    account: await createLightAccount({
      chain: arbitrumSepolia,
      transport: alchemyTransport,
      signer: LocalAccountSigner.privateKeyToAccountSigner(generatePrivateKey()),
    }),
  });
};
