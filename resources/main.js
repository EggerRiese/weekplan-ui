// Function to change every id from 1 to 2 within the copied div
function changeIds(element, inputId) {
    // Change the id from ending with 1 to ending with 2
    element.id = element.id.slice(0, -1) + inputId;
    element.name = element.name?.slice(0, -1) + inputId;

    // Recursively process all child elements
    for (var i = 0; i < element.children.length; i++) {
        changeIds(element.children[i], inputId);
    }
}

const { createApp, ref } = Vue

  createApp({
    data: () => ({
        shoppingList: null,
        inputId: 1
    }),

    setup() {
      const message = ref('Hello vue!')
      return {
        message
      }
    },

    methods: {
        async fetchData() {
            this.shoppingList = 
            [
                {
                    "name": "Nudeln",
                    "amount": "500",
                    "unit": "g"
                },
                {
                    "name": "Pesto",
                    "amount": "100",
                    "unit": "g"
                },
                {
                    "name": "Cashew Nüsse",
                    "amount": "1 Hand voll",
                    "unit": "h"
                }
            ];
        },
        createInput() {
            const existingInput = document.getElementById('input-' + this.inputId);
            const newInput = existingInput.cloneNode(true);

            this.inputId++;

            changeIds(newInput, this.inputId);

            document.getElementById(existingInput.id).appendChild(newInput);
        }
    }
  }).mount('#app')


document.getElementById('meal-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Capture form data
    const formData = new FormData(event.target);

    // Convert form data to JSON
    const data = {};
    data['title'] = formData.get('meal-title');
    const ingredients = {};
    
    var i = 1;
    while (formData.has('meal-ingredient-' + i)) {
        var ingredient = {};
        ingredient['name'] = formData.get('meal-ingredient-' + i);
        ingredient['amount'] = formData.get('meal-ingredient-amount-' + i);
        ingredient['unit'] = formData.get('meal-ingredient-unit' + i);

        ingredients.push(ingredient);
        i++;
    }

    data['ingredients'] = ingredients;

    // Send POST request with JSON data
    fetch('http://localhost:8080/meals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'f82222f3-c6b7-4cbf-8343-2df94e10237f'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});