var Payroll = artifacts.require("./Payroll.sol");

contract('Payroll', function(accounts) {
  const owner = accounts[0];
  const employeeId1 = accounts[1];
  const salary1 = 1;
  const employeeId2 = accounts[2];
  const salary2 = 1;

  console.log(accounts);

  /**
   * Test `addEmployee(address employeeId, uint salary) onlyOwner`
   */
  // Add employee successfully
  it("should add employee successfully.", () => {
    let payrollInstance;

    return Payroll.deployed().then((instance) => {
      payrollInstance = instance;

      return payrollInstance.addEmployee(
        employeeId1, salary1, {from: owner});
    }).then(() => {
      return payrollInstance.employees.call(employeeId1);
    }).then((employee) => {
      // Check null
      assert.notEqual(
        employee[0], "0x0000000000000000000000000000000000000000",
        "No employee has been added.");

      // Check address
      assert.equal(
        employee[0], employeeId1,
        "The address of new employee does not match.");

      // Check salary
      assert.equal(
        web3.fromWei(employee[1], "ether").toNumber(), salary1,
        "The salary of new employee does not match.");
    });
  });

  // Check message sender
  it("should not add employee, " +
     "if the message sender is not the contract owner.", () => {
    let payrollInstance;

    return Payroll.deployed().then((instance) => {
      payrollInstance = instance;

      return payrollInstance.addEmployee(
        employeeId1, salary1, {from: employeeId2});
    }).then(() => {
      assert(false, "The employee should not be added.");
    }).catch((error) => {
      assert(true, "The employee should not be added.");
    });
  });

  /**
   * Test `removeEmployee(address employeeId) onlyOwner employeeExist(employeeId)`
   */
  // Remove employee successfully
  it("should remove employee successfully.", () => {
    let payrollInstance;

    return Payroll.deployed().then((instance) => {
      payrollInstance = instance;

      return payrollInstance.addEmployee(
        employeeId2, salary2, {from: owner});
    }).then(() => {
      return payrollInstance.removeEmployee(
        employeeId2, {from: owner});
    }).then(() => {
      return payrollInstance.employees.call(employeeId2);
    }).then((employee) => {
      // Check null
      assert.equal(
        employee[0], "0x0000000000000000000000000000000000000000",
        "The employee should be removed.");
    });
  });

  // Remove unknown employee
  it("should not remove an unknown employee.", () => {
    let payrollInstance;

    return Payroll.deployed().then((instance) => {
      payrollInstance = instance;

      return payrollInstance.removeEmployee(
        employeeId2, {from: owner});
    }).then(() => {
      assert(false, "Unknown employee.");
    }).catch((error) => {
      assert(true, "Unknown employee.");
    });
  });

  // Check message sender
  it("should not remove employee, " +
     "if the message sender is not the contract owner.", () => {
    let payrollInstance;

    return Payroll.deployed().then((instance) => {
      payrollInstance = instance;

      return payrollInstance.addEmployee(
        employeeId2, salary2, {from: owner});
    }).then(() => {
      return payrollInstance.removeEmployee(
        employeeId2, {from: employeeId2});
    }).then(() => {
      assert(false, "The employee should not be added.");
    }).catch((error) => {
      assert(true, "The employee should not be added.");
    });
  });

});