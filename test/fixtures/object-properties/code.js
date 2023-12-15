function TestIDObjectProps({testID}) {
  return {
    testID: testID
  }
}

function WrongTestIDObjectProps({ wrongTestID }) {
  return {
    wrongTestID: wrongTestID
  };
}

function App() {
  TestIDObjectProps({});
  WrongTestIDObjectProps({
    wrongTestID: objectFromTestID.TestIDObjectProps
  });
}
