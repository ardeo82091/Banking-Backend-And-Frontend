const Bank = require("./bank");
const Account = require("./account");
const Credential = require("./credential");
const bcrypt = require("bcrypt");
const uuid = require('uuid');
class Customer {
    static allCustomers = [];
    constructor(fullName,credentials,role) {
        this.customerID = uuid.v4();
        this.fullName = fullName;
        this.credentials= credentials;
        this.role = role;
        this.isActive = true;
        this.account = []
        this.totalBalance = 0
    }

    static async createBankManager(firstname,lastname,username,passworD)
    {
        let userName = username;
        let password = passworD;
        let firstName = firstname;
        let lastName = lastname;
        let role = "banker";
        let fullName = `${firstName} ${lastName}` 
        const [flag,message,newCredential] = Credential.createCredential(userName,password);
        if(flag === false)
        {
            return [null,"Username already Exist"];
        }
        newCredential.password = await newCredential.getHashPassword();
        let newBanker = new Customer(fullName,newCredential,role);
        Customer.allCustomers.push(newBanker);
        return [newBanker,"Banker created Successfully"];
    }

    async createNewCustomer(firstName, lastName,userName,password) 
    {
        if(this.isActive == false) return [null,"Not able to create an Customer"];
        if(this.role != "banker") return [null,"Please Specify the role to Banker to create a User"];
        let fullName = `${firstName} ${lastName}`        
        let role = "customer";
        const [flag,message,newCredential] = Credential.createCredential(userName,password);
        if(flag === false)
        {
            return [null,"UserName already Exists"]
        }
        
        newCredential.password = await newCredential.getHashPassword();
        let newCustomer = new Customer(fullName,newCredential,role);
        Customer.allCustomers.push(newCustomer);
        return [newCustomer," Customer created Successfully"]
    }

    static findCustomer(userName) {
        if(this.isActive == false) return [-1,false];
        if(Customer.allCustomers.length == 0) return [-1,false];
        for (let index = 0; index < Customer.allCustomers.length; index++) {
            if (Customer.allCustomers[index].credentials.userName == userName && Customer.allCustomers[index].isActive == true) {
                return [index, true];
            }
        }
        return [-1, false];
    }

    static isCustomerIdExists(customerId)
    {
        if(this.isActive == false) return [-1,false];
        for (let index = 0; index < Customer.allCustomers.length; index++) {
            if (Customer.allCustomers[index].customerID == customerId) {
                return [index, true];
            }
        }
        return [-1, false]; 
    }

    async comparePassword(password)
    {
        let isPasswordMatch = await bcrypt.compare(password,this.credentials.password);
        return isPasswordMatch;
    }

    updatetotalBalance() {
        if(this.account.length==0){
            return [false,"no account exist"];
        }
        let totalbalance = 0;
        for (let index = 0; index < this.account.length; index++) {
            totalbalance +=  this.account[index].balance;
        }
        this.totalBalance = totalbalance;
    }

    static createnewAccount(bankAbbrevation,userName) {
        let [indexOfCustomer,isCustomerExists] = Customer.findCustomer(userName);
        if(!isCustomerExists)
        {
            return [null,"No customer Exist with this UserName"]
        }

        let [index, isBankexist] = Bank.findBank(bankAbbrevation)
        if (!isBankexist) {
            return [null, `No bank exit with name ${bankAbbrevation}`]
        }
        let bank = Bank.allBanks[index].bankAbbrevation;
        let [indexOfAccount,isAccountExist] = Customer.allCustomers[indexOfCustomer].isAccountExist(bankAbbrevation);
        if(isAccountExist)
        {
            return [null,"Already have an account with this Bank"];
        }
        const newAccount = new Account(bank);
        Customer.allCustomers[indexOfCustomer].account.push(newAccount);
        Customer.allCustomers[indexOfCustomer].updatetotalBalance();
        return [newAccount,"Account created"]
    }

    static getUserAllAccount(userName)
    {
        let [indexOfCustomer,isCustomerExists] = Customer.findCustomer(userName);
        if(!isCustomerExists)
        {
            return [false,null,"No customer Exist with this UserName"]
        }
        return [true,Customer.allCustomers[indexOfCustomer].account,"All Accounts"];
    }

    isAccountExist(bankAbbrevation) {
        if (this.isActive == false)
        {
            return [-1,false];
        }
        if (this.account.length == 0) 
        {
            return [-1, false];
        }
        for (let index = 0; index < this.account.length; index++) 
        { 
            if (this.account[index].bankAbbrevation == bankAbbrevation) {
                return [index, true]
            }
        }
        return [-2, false];
    }

    withdraw(amount, bankAbrre)
    {
        let [indexOfBank, isAccountexist] = this.isAccountExist(bankAbrre);
        if(isAccountexist==false) return [false, "Account not Exists"];
        let tbalance = this.account[indexOfBank].balance ;
        if(tbalance - amount <1000)
        {
            return [false, "Not Sufficient Balance"];
        }
        this.account[indexOfBank].balance -=  amount;
        this.updatetotalBalance();
        return [true, "Successfull Withdraw"];
    }

    deposit(amount, bankAbrre)
    {
        let [indexOfBank, isAccountExist] = this.isAccountExist(bankAbrre);
        if(isAccountExist==false) return [false, "Account not Exists"];
        this.account[indexOfBank].balance +=  amount;
        this.updatetotalBalance();
        return [true, "Successfully Deposit"];
    }

    transfer(amount, creditCustomer, creditBankAbbre, debitBankAbbre)
    {
        let [indexOfCustomer, customerExists] = Customer.findCustomer(creditCustomer);
        if(!customerExists) 
        {
            return [false,"Customer not exist"];
        }
        let [checkWithDraw,info] = this.withdraw(amount, debitBankAbbre);
        if(!checkWithDraw)
        {
            return [false,"Withdraw Failed"];
        }
        let [checkDeposit,message] = Customer.allCustomers[indexOfCustomer].deposit(amount, creditBankAbbre);
        if(!checkDeposit)
        {
            this.deposit(amount, debitBankAbbre);
            return [false,"Deposit Failed"];
        }
        return[true,"Deposit Successfull"];
    }

    // selfTransfer(amount, creditBankAbbre, debitBankAbbre)
    // {
    //     let [transfer,message]=this.transfer(amount, this.userName, creditBankAbbre, debitBankAbbre);
    //     return [transfer,message];
    // }

    updateFirstname(newFullname) {
        this.fullName = newFullname;
    }

    updateUserName(value){
        this.credentials.userName = value
    }

    update(propertyToUpdate, value)
    {
        switch (propertyToUpdate) 
        {
            case "fullName": 
                this.updateFirstname(value)
                return true;
            
            case "userName":
                this.updateUserName(value)
                return true;

            default: return false;
        }
    }

}

module.exports = Customer;