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

function addFormListener() {
    document.getElementById('meal-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Capture form data
        const formData = new FormData(event.target);

        // Convert form data to JSON
        const data = {
            title: formData.get('meal-title'),
            ingredients: [],
        };
        
        let i = 1;
        while (formData.has('meal-ingredient-' + i)) {
            data.ingredients.push({
            name: formData.get('meal-ingredient-' + i),
            amount: formData.get('meal-ingredient-amount-' + i),
            unit: formData.get('meal-ingredient-unit-' + i),
            });
            i++;
        }

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
}

const { createApp, ref } = Vue

  createApp({
    data: () => ({
        tab: 1,
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
        switchTab(switchTo) {
            this.tab = switchTo;

            if (this.tab === 2) {
                this.addFormListener();
            } else if (this.tab === 3) {
                this.fetchData();
            }
        },
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