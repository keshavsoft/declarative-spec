export function createTopbarActions({ onSwitchTab }) {
  return {
    openTab1: () => {
      onSwitchTab('tab1');
    },
    openTab2: () => {
      onSwitchTab('tab2');
    }
  };
}

export default createTopbarActions;