export const focusSearchInput = (ref) => {
  if (ref?.current) {
    setTimeout(() => ref.current.focus(), 150);
  }
};
