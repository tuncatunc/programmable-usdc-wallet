import React, { ReactElement } from "react";

export const Start: React.FC = (): ReactElement => {
  return (
    <div className="w-32 h-full">
      <div>
        <button>Create a New Wallet</button>
      </div>
      <div>
        <button>Restore Wallet</button>
      </div>
    </div>
  )
}
