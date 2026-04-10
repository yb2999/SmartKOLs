"use client";

import { useMockStore } from "@/lib/mock-store";
import AccountNav from "@/components/layout/AccountNav";
import { useParams } from "next/navigation";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const id = params.id as string;
  const { accounts } = useMockStore();
  const account = accounts.find((a) => a.id === id);

  return (
    <div>
      {/* Account Header */}
      <div className="border-b border-[#E8E8E8] bg-[#F7F7F7]/90 backdrop-blur sticky top-0 z-30">
        <div className="px-6 pt-5 pb-0">
          <div className="flex items-center gap-3 mb-4">
            {account && (
              <>
                <img
                  src={`https://unavatar.io/twitter/${account.avatarSeed}`}
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.avatarSeed}`; }}
                  alt={account.displayName}
                  className="w-8 h-8 rounded-full bg-[#E8E8E8]"
                />
                <div>
                  <p className="text-[#111111] font-semibold text-sm">{account.displayName}</p>
                  <p className="text-[#999999] text-xs">{account.handle}</p>
                </div>
              </>
            )}
          </div>
          <AccountNav accountId={id} />
        </div>
      </div>

      <div className="p-8">{children}</div>
    </div>
  );
}
