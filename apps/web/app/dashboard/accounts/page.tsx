"use client"
import React from "react";
import AccountRow from "./components/accountRow";
import { Button } from "@workspace/ui/components/button"; // mantendo consistência com outros controles
import { X, Plus } from "lucide-react";

import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";




export default function AccountsPage() {

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const trpc = useTRPC()

  const { data } = useQuery(trpc.providers.GetAllProvidersFromAccount.queryOptions())


  return (
    <div className="min-h-screen p-6 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">
              Contas conectadas
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Gerencie as contas conectadas às suas plataformas.
            </p>
          </div>

          <Button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Adicionar conta
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {data?.accounts.map((acc, idx) => (
            <AccountRow key={idx} account={acc} />
          ))}

          {data?.accounts.length === 0 && (
            <div className="rounded border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Nenhuma conta conectada.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}



