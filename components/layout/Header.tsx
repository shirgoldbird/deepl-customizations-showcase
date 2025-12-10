"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SettingsModal } from "./SettingsModal";

export function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="bg-deepl-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">DeepL Customizations Showcase</h1>
              <p className="text-blue-200 mt-1">
                Try out Style Rules & Custom Instructions in our API!
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
              aria-label="Open settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
