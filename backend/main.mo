import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Iter "mo:core/Iter";

actor {
  let admins = Map.singleton("admin", "admin");
  let departments = Map.empty<Text, [Text]>();
  let employees = Map.empty<Text, Text>();
  let queues = Map.empty<Text, [Text]>();
  let visitorCheckinRecords = Map.empty<Nat, Text>();
  let checkinCookies = Map.empty<Nat, Text>();

  type VisitorUpdate = {
    queueId : Text;
    timestamp : Int;
  };

  let employeeTracker = Map.empty<Text, [VisitorUpdate]>();
  let adminLogs = Map.empty<Text, Text>();

  public shared ({ caller }) func addDepartment(department : Text, employees : [Text], queuesList : [Text]) : async () {
    switch (admins.get("admin")) {
      case (?_) {
        departments.add(department, employees);
        queues.add(department, queuesList);
      };
      case (null) { return };
    };
  };

  public shared ({ caller }) func addEmployee(department : Text, employee : Text) : async () {
    switch (admins.get("admin")) {
      case (?_) {
        switch (departments.get(department)) {
          case (?existingEmployees) {
            departments.add(department, existingEmployees.concat([employee]));
          };
          case (null) {
            departments.add(department, [employee]);
          };
        };
        employees.add(employee, department);
      };
      case (null) { return };
    };
  };

  public shared ({ caller }) func addQueue(department : Text, queue : Text) : async () {
    switch (admins.get("admin")) {
      case (?_) {
        switch (queues.get(department)) {
          case (?existingQueues) {
            queues.add(department, existingQueues.concat([queue]));
          };
          case (null) {
            queues.add(department, [queue]);
          };
        };
      };
      case (null) { return };
    };
  };

  public shared ({ caller }) func createAdminLogs(user : Text, action : Text) : async () {
    switch (admins.get("admin")) {
      case (?_) { adminLogs.add(user, action) };
      case (null) { return };
    };
  };

  public shared ({ caller }) func checkInVisitor(visitorType : Text, visitorId : Nat, queueId : Text, employeeId : ?Text) : async () {
    switch (queues.get(visitorType)) {
      case (?queueArray) {
        if (not queueArray.values().contains(queueId)) {
          return;
        };
      };
      case (null) {
        return;
      };
    };

    let currentTime = Time.now();
    checkinCookies.add(visitorId, "Checked in: " # queueId # " at " # currentTime.toText());

    switch (employeeId) {
      case (?empId) {
        let update : VisitorUpdate = {
          queueId;
          timestamp = currentTime;
        };
        switch (employeeTracker.get(empId)) {
          case (?updates) {
            employeeTracker.add(empId, updates.concat([update]));
          };
          case (null) {
            employeeTracker.add(empId, [update]);
          };
        };
      };
      case (null) {};
    };
  };

  public query ({ caller }) func viewQueueStatus(queueId : Text) : async Text {
    "Queue status for " # queueId;
  };

  public shared ({ caller }) func updateQueueMode(queueId : Text) : async () {
    switch (admins.get("admin")) {
      case (?_) {};
      case (null) { return };
    };
  };

  public shared ({ caller }) func createNewId(counter : Nat) : async Nat {
    switch (admins.get("admin")) {
      case (?_) { counter };
      case (null) { 0 };
    };
  };

  public query ({ caller }) func getDepartments() : async [(Text, [Text])] {
    departments.toArray();
  };

  public query ({ caller }) func getEmployees() : async [(Text, Text)] {
    employees.toArray();
  };

  public query ({ caller }) func getQueues() : async [(Text, [Text])] {
    queues.toArray();
  };

  public query ({ caller }) func getVisitorCheckinRecords() : async [(Nat, Text)] {
    visitorCheckinRecords.toArray();
  };

  public query ({ caller }) func getAdminLogs() : async [(Text, Text)] {
    adminLogs.toArray();
  };
};
