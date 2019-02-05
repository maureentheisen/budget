
//BUDGET CONTROLLER
var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItem[type].forEach(function(){
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems:{
            exp : [],
            inc : [],
        },
        totals :{
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return{
        addItem: function(type, des, val){

            var newItem, ID;


            // create new ID
            if(data.allItems[type].length > 0){   
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            } else{
                ID = 0;
            } 

            // create new item based on 'inc' or 'exp' typye
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            
            // push it into our data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;
        },

        deleteItem: function(type, id){
            var ids, index;

            //data.allItems[type][id];

            ids = data.allItems[type].map(function(current){

                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function(){
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function(){
            console.log(data);
        }
    };

})();


//UI CONTROLLER
var uiController = (function() {


    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expense__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: 'budget__expenses--percentage',
        container: '.container'
    };

    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value, // will be either or inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function(obj, type){
            var html, newHtml, element;
            // create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '%id% %description% %value% income';
            } else if (type === 'exp'){
                element = DOMstring.expenseContainer;
                html = '%id% %description% %value%  expense';
            }

            // replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // insert the HTML into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function(){
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(field, index, array){
                field.value = '';
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            

            if(obj.percentage > 0 ){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    };

})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, uiCtrl){

    var setUpEventListeners = function(){
        var DOM = uiCtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function(){

        //1. calculate the budget
        budgetCtrl.calculateBudget();

        //2. return the budget
        var budget = budgetCtrl.getBudget();

        //3. display the budget
        uiCtrl.displayBudget(budget);

    };

    var ctrlAddItem = function(){
        var input, newItem;

        //1. get the field input data
        var input = uiCtrl.getInput();
        
        
        if(input.description !== '' && !isNaN(input.value) && input.value > 0){
            //2. add item to the budget controller
            newItem = budgetCtrl.addItem(input.type,  input.description, input.value);

            //3. add the new item to the UI
            uiCtrl.addListItem(newItem, input.type);

            //4. clear the fields
            uiCtrl.clearFields();

            //5. Calculate and update budget
            updateBudget();
        }
    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.id;

        if(itemID){
            //inc-1
            splitID = itemID.split('-');
            type = spitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item
            budgetCtrl.deleteItem(type, ID);

            // 2. delete the item from user interface
            uiCtrl.deleteListItem(itemID);

            // 3. update and show the new budget
            updateBudget();
        }
    };

    return {
        init: function(){                                                                                       
            console.log('application has started');
            uiCtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setUpEventListeners();                                                                                                                                                                                                                                              
        }
    }

})(budgetController, uiController);

controller.init();






