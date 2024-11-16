"use client";
import AuthLayout from "../components/layout/AuthLayout";
import { useState } from "react";

export default function SettingsPage() {
  // These would eventually connect to user preferences storage
  const [settings, setSettings] = useState({
    autoPassTurn: false,
    showResourceTotals: true,
    showCardCosts: true,
    confirmActions: true,
    showTutorialTips: true,
    sound: true,
    music: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AuthLayout title="Settings">
      <div className="bg-blue-900 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gold-300 mb-4">
          Settings
        </h2>
        <div className="space-y-6">
          {/* Gameplay Settings */}
          <div className="bg-blue-800/40 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gold-300 mb-4">Gameplay</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-blue-100">
                <div>
                  <label className="text-sm text-blue-300">Auto-Pass Turn</label>
                  <p className="text-xs text-blue-400">Automatically pass turn when no more actions available</p>
                </div>
                <button 
                  onClick={() => toggleSetting('autoPassTurn')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.autoPassTurn 
                      ? 'bg-emerald-700 hover:bg-emerald-600' 
                      : 'bg-blue-700 hover:bg-blue-600'
                  }`}
                >
                  {settings.autoPassTurn ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between text-blue-100">
                <div>
                  <label className="text-sm text-blue-300">Show Resource Totals</label>
                  <p className="text-xs text-blue-400">Show resource totals on the game board</p>
                </div>
                <button 
                  onClick={() => toggleSetting('showResourceTotals')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.showResourceTotals 
                      ? 'bg-emerald-700 hover:bg-emerald-600' 
                      : 'bg-blue-700 hover:bg-blue-600'
                  }`}
                >
                  {settings.showResourceTotals ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between text-blue-100">
                <div>
                  <label className="text-sm text-blue-300">Show Card Costs</label>
                  <p className="text-xs text-blue-400">Show card costs on the game board</p>
                </div>
                <button 
                  onClick={() => toggleSetting('showCardCosts')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.showCardCosts 
                      ? 'bg-emerald-700 hover:bg-emerald-600' 
                      : 'bg-blue-700 hover:bg-blue-600'
                  }`}
                >
                  {settings.showCardCosts ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between text-blue-100">
                <div>
                  <label className="text-sm text-blue-300">Confirm Actions</label>
                  <p className="text-xs text-blue-400">Confirm actions before they are executed</p>
                </div>
                <button 
                  onClick={() => toggleSetting('confirmActions')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.confirmActions 
                      ? 'bg-emerald-700 hover:bg-emerald-600' 
                      : 'bg-blue-700 hover:bg-blue-600'
                  }`}
                >
                  {settings.confirmActions ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between text-blue-100">
                <div>
                  <label className="text-sm text-blue-300">Show Tutorial Tips</label>
                  <p className="text-xs text-blue-400">Show tutorial tips during the game</p>
                </div>
                <button 
                  onClick={() => toggleSetting('showTutorialTips')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.showTutorialTips 
                      ? 'bg-emerald-700 hover:bg-emerald-600' 
                      : 'bg-blue-700 hover:bg-blue-600'
                  }`}
                >
                  {settings.showTutorialTips ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>

          {/* Sound Settings */}
          <div className="bg-blue-800/40 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gold-300 mb-4">Sound</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-blue-100">
                <div>
                  <label className="text-sm text-blue-300">Sound Effects</label>
                  <p className="text-xs text-blue-400">Enable or disable sound effects</p>
                </div>
                <button 
                  onClick={() => toggleSetting('sound')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.sound 
                      ? 'bg-emerald-700 hover:bg-emerald-600' 
                      : 'bg-blue-700 hover:bg-blue-600'
                  }`}
                >
                  {settings.sound ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between text-blue-100">
                <div>
                  <label className="text-sm text-blue-300">Background Music</label>
                  <p className="text-xs text-blue-400">Enable or disable background music</p>
                </div>
                <button 
                  onClick={() => toggleSetting('music')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.music 
                      ? 'bg-emerald-700 hover:bg-emerald-600' 
                      : 'bg-blue-700 hover:bg-blue-600'
                  }`}
                >
                  {settings.music ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
