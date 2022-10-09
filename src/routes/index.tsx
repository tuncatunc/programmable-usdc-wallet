import React, { ReactElement, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { Root } from "./Root"
import { Start } from "./Start";
import { CreateWallet } from "./CreateWallet";
import { RestoreWallet } from "./RestoreWallet";
import { SetPassword } from "./SetPassword"
import { Password } from "./Password";
import { Error } from "./Error";
import { CreatePortfolio } from "./CreatePortfolio";
import { EditPortfolio } from "./EditPortfolio";

import { Portfolios } from "./Portfolios";
import { Mnemonic } from "./Mnemonic";
import { PorfolioDeposit } from "./PortfolioDeposit";
import { Withdraw } from "./Withdraw";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "start",
        element: <Start />
      },
      {
        path: "create-wallet",
        element: <CreateWallet />
      },
      {
        path: "restore-wallet",
        element: <RestoreWallet />
      },
      {
        path: "set-password",
        element: <SetPassword />
      },
      {
        path: "password",
        element: <Password />
      },
      {
        path: "create-portfolio",
        element: <CreatePortfolio />
      },
      {
        path: "edit-portfolio/:accountIndex",
        element: <EditPortfolio />
      },
      {
        path: "portfolios",
        element: <Portfolios />
      },
      {
        path: "mnemonic",
        element: <Mnemonic />
      },
      {
        path: "deposit/:accountIndex",
        element: <PorfolioDeposit />
      },
      {
        path: "withdraw/:accountIndex/:subaccountIndex",
        element: <Withdraw />
      }
    ]
  }
]);

export const AppRoutes: React.FC = (): ReactElement => {
  return <RouterProvider router={router} />

}