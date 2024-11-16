"use client";
import AuthLayout from "../components/layout/AuthLayout";
import { useUser } from "@account-kit/react";

export default function ProfilePage() {
  const user = useUser();

  return (
    <AuthLayout title="Profile">
      <div className="bg-blue-900 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gold-300 mb-4">
          Profile
        </h2>
        <div className="space-y-6">
          <div className="bg-blue-800/40 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gold-300 mb-4">Account Details</h3>
            <div className="space-y-4 text-blue-100">
              <div>
                <label className="block text-sm text-blue-300">Email</label>
                <div className="text-lg">{user?.email || 'Not available'}</div>
              </div>
              <div>
                <label className="block text-sm text-blue-300">Wallet Address</label>
                <div className="text-sm font-mono">{user?.address || 'Not available'}</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-800/40 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gold-300 mb-4">Game Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-blue-100">
              <div>
                <label className="block text-sm text-blue-300">Games Played</label>
                <div className="text-lg">0</div>
              </div>
              <div>
                <label className="block text-sm text-blue-300">Win Rate</label>
                <div className="text-lg">0%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
