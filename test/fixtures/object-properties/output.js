function TestIDObjectProps({}) {
  return {};
}
function WrongTestIDObjectProps({ wrongTestID }) {
  return {
    wrongTestID: wrongTestID,
  };
}
function App() {
  TestIDObjectProps({});
  WrongTestIDObjectProps({
    wrongTestID: objectFromTestID.TestIDObjectProps,
  });
}
