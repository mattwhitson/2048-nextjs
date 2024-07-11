import { EndGameModal } from "@/components/modals/end-game-modal";
import { SettingsModal } from "@/components/modals/settings-modal";

export function ModalProvider() {
  return (
    <>
      <EndGameModal />
      <SettingsModal />
    </>
  );
}
