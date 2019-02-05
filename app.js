
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

    var data = {
        allItems:{
            exp : [],
            inc : [],
        },
        totals :{
            exp: 0,
            inc: 0
        } 
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
        expensesContainer: '.expense__list'
    }

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

        clearFields: function(){
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(field, index, array){
                field.value = '';
            });

            fieldsArr[0].focus();
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
    };

    var updateBudget = function(){

        //1. calculate the budget

        //2. return the budget

        //3. display the budget

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
    }

    return {
        init: function(){
            console.log('application has started');
            setUpEventListeners();
        }
    }

})(budgetController, uiController);

controller.init();






