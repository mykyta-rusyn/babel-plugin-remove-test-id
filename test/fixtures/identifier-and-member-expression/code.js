TestStrings.first;
TestStrings.second;

ObjectWithDataTestID.anyString;

WrongTestString.first;
WrongTest.second;

WrongObjectWithDataTestID.anyString;

f(TestObject);
f(TestObject.q);

f(WrongTestObject);
f(WrongTestObject.q);

TestStrings;
ObjectWithDataTestID;
WrongTestStrings;
WrongObjectWithDataTestID;

if (true) {
	TestStrings;
	ObjectWithDataTestID;
	WrongTestStrings;
	WrongObjectWithDataTestID;
} else {
	TestStrings
	ObjectWithDataTestID;
	WrongTestStrings;
	WrongObjectWithDataTestID;
}