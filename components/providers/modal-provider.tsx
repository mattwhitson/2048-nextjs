import { EndGameModal } from "@/components/modals/end-game-modal";
import { SettingsModal } from "@/components/modals/settings-modal";
import { WonGameModal } from "@/components/modals/won-game-modal";

export function ModalProvider() {
  return (
    <>
      <EndGameModal />
      <SettingsModal />
      <WonGameModal />
    </>
  );
}
